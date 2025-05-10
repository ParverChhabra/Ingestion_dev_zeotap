package com.example.ingestiontool.controller;

import com.example.ingestiontool.model.ConnectionConfig;
import com.example.ingestiontool.model.ExportRequest;
import com.example.ingestiontool.model.IngestionRequest;
import com.example.ingestiontool.model.TableRequest;
import com.example.ingestiontool.service.ClickHouseService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.Connection;
import java.util.List;
import java.util.ArrayList;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/clickhouse")
public class IngestionController {

    ClickHouseService clickHouseService = new ClickHouseService();

    // @GetMapping("/tables")
    @PostMapping("/tables")
public ResponseEntity<?> getTables(@RequestBody ConnectionConfig config) {
    try {
        List<String> tables = clickHouseService.getTableList(config);
        return ResponseEntity.ok(tables);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Failed to fetch tables: " + e.getMessage());
    }
}

@CrossOrigin(origins = "http://localhost:5173")
@PostMapping("/columns")
public ResponseEntity<?> getColumns(@RequestBody TableRequest request) {
    try {
        List<String> columns = clickHouseService.getColumnsForTable(
                request.tableName,
                request.connection
        );
        return ResponseEntity.ok(columns);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Failed to fetch columns: " + e.getMessage());
    }
}


@CrossOrigin(origins = "http://localhost:5173")
@PostMapping("/ch-to-file")
public ResponseEntity<?> exportToCSV(@RequestBody ExportRequest request) {
    try {
        clickHouseService.exportTableToCSV(
                request.tableName,
                request.outputFilePath,
                request.connection
        );
        return ResponseEntity.ok("Export successful. File saved at: " + request.outputFilePath);
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Export failed: " + e.getMessage());
    }
}

@CrossOrigin(origins = "http://localhost:5173")
@PostMapping("/file-to-ch")
public ResponseEntity<?> ingestCSV(@RequestBody IngestionRequest request) {
    try {
        clickHouseService.ingestCSVtoTable(
                request.tableName,
                request.inputFilePath,
                request.connection
        );
        return ResponseEntity.ok("Ingestion successful!");
    } catch (Exception e) {
        return ResponseEntity.badRequest().body("Ingestion failed: " + e.getMessage());
    }
}



}
