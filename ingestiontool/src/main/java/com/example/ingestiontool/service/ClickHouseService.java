package com.example.ingestiontool.service;

import com.example.ingestiontool.model.ConnectionConfig;

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.ResultSet;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVPrinter;
import org.apache.commons.csv.CSVRecord;

import java.util.ArrayList;
import java.util.Arrays;
import java.io.Reader;
import java.sql.Date;




public class ClickHouseService {

    public Connection connectToClickHouse(ConnectionConfig config) throws SQLException {
        String url = String.format("jdbc:clickhouse://%s:%d/%s?compress=0", config.host, config.port, config.database);

        return DriverManager.getConnection(url, config.user, config.jwtToken); // JWT token used as password
    }

    public List<String> getTableList(ConnectionConfig config) throws SQLException {
        List<String> tables = new ArrayList<>();
        String query = "SHOW TABLES";

        try (Connection connection = connectToClickHouse(config);
             Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                tables.add(rs.getString(1));
            }
        }

        return tables;
    }
    public List<String> getColumnsForTable(String tableName, ConnectionConfig config) throws SQLException {
        List<String> columns = new ArrayList<>();
        String query = "DESCRIBE TABLE " + tableName;
    
        try (Connection connection = connectToClickHouse(config);
             Statement stmt = connection.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {
    
            while (rs.next()) {
                columns.add(rs.getString("name")); // Column names are in "name"
            }
        }
    
        return columns;
    }

    public int exportTableToCSV(String tableName, String outputFilePath, ConnectionConfig config) throws SQLException, IOException {
    String query = "SELECT * FROM " + tableName;

    try (Connection connection = connectToClickHouse(config);
         Statement stmt = connection.createStatement();
         ResultSet rs = stmt.executeQuery(query);
         BufferedWriter writer = Files.newBufferedWriter(Paths.get(outputFilePath));
         CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.withHeader(rs))) {

        int columnCount = rs.getMetaData().getColumnCount();
        int rowCount =0;
        while (rs.next()) {
            List<Object> row = new ArrayList<>();
            for (int i = 1; i <= columnCount; i++) {
                row.add(rs.getObject(i));
            }
            csvPrinter.printRecord(row);
            rowCount++;
        }

        csvPrinter.flush();
        return rowCount;
    }
    
}

public int ingestCSVtoTable(String tableName, String inputFilePath, ConnectionConfig config)
        throws SQLException, IOException {

    List<String> columnTypes = inferColumnTypes(inputFilePath, 10); // Sample 10 rows

    try (Connection connection = connectToClickHouse(config);
         Reader reader = Files.newBufferedReader(Paths.get(inputFilePath));
         CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

        List<String> headers = csvParser.getHeaderNames();
        String insertSQL = buildInsertSQL(tableName, headers);
        PreparedStatement pstmt = connection.prepareStatement(insertSQL);

        int batchSize = 0;
        int inserted = 0;

        for (CSVRecord record : csvParser) {
            for (int i = 0; i < headers.size(); i++) {
                String value = record.get(i);
                switch (columnTypes.get(i)) {
                    case "Int32":
                        pstmt.setInt(i + 1, value.isEmpty() ? 0 : Integer.parseInt(value));
                        break;
                    case "Float64":
                        pstmt.setDouble(i + 1, value.isEmpty() ? 0.0 : Double.parseDouble(value));
                        break;
                    case "Date":
                        pstmt.setDate(i + 1, Date.valueOf(value));
                        break;
                    default:
                        pstmt.setString(i + 1, value);
                }
            }

            pstmt.addBatch();
            if (++batchSize % 1000 == 0) {
                inserted += pstmt.executeBatch().length;
            }
        }

        inserted += pstmt.executeBatch().length;
        return inserted;
    }
}

private String buildInsertSQL(String tableName, List<String> headers) {
    String cols = String.join(", ", headers);
    String placeholders = headers.stream().map(h -> "?").collect(Collectors.joining(", "));
    return String.format("INSERT INTO %s (%s) VALUES (%s)", tableName, cols, placeholders);
}

private String buildInsertQuery(String tableName, String filePath) throws IOException {
    // Read header from CSV file to build insert query
    try (Reader reader = Files.newBufferedReader(Paths.get(filePath));
         CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {
        List<String> headers = csvParser.getHeaderNames();
        String columns = String.join(", ", headers);
        String placeholders = headers.stream().map(h -> "?").collect(Collectors.joining(", "));
        return String.format("INSERT INTO %s (%s) VALUES (%s)", tableName, columns, placeholders);
    }
}

private List<String> inferColumnTypes(String filePath, int sampleRows) throws IOException {
    List<String> types = new ArrayList<>();

    try (Reader reader = Files.newBufferedReader(Paths.get(filePath));
         CSVParser csvParser = new CSVParser(reader, CSVFormat.DEFAULT.withFirstRecordAsHeader())) {

        List<CSVRecord> records = csvParser.getRecords();
        if (records.isEmpty()) return types;

        List<String> headers = csvParser.getHeaderNames();
        int columnCount = headers.size();
        String[] inferredTypes = new String[columnCount];
        Arrays.fill(inferredTypes, "Int32");

        for (int row = 0; row < Math.min(sampleRows, records.size()); row++) {
            CSVRecord record = records.get(row);

            for (int i = 0; i < columnCount; i++) {
                String value = record.get(i);

                if (value == null || value.isEmpty()) continue;

                if (inferredTypes[i].equals("String")) continue;

                if (inferredTypes[i].equals("Int32") && !value.matches("-?\\d+")) {
                    inferredTypes[i] = value.matches("-?\\d+\\.\\d+") ? "Float64" : "String";
                } else if (inferredTypes[i].equals("Float64") && !value.matches("-?\\d+(\\.\\d+)?")) {
                    inferredTypes[i] = "String";
                } else if (value.matches("\\d{4}-\\d{2}-\\d{2}")) {
                    inferredTypes[i] = "Date";
                }
            }
        }

        return Arrays.asList(inferredTypes);
    }
}


}
