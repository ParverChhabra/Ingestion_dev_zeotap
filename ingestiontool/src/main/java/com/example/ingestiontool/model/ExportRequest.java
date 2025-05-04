package com.example.ingestiontool.model;

public class ExportRequest {
    public String tableName;
    public String outputFilePath;  // e.g. /tmp/output.csv
    public ConnectionConfig connection;
}
