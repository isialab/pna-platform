<?php
// Enable error reporting
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Log to file to verify execution
file_put_contents(__DIR__ . '/debug.log', date('[Y-m-d H:i:s] ') . "Request received: " . $_SERVER['REQUEST_METHOD'] . "\n", FILE_APPEND);

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$dbFile = __DIR__ . '/database.json';
$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'register') {
        // Get raw posted data
        $input = file_get_contents("php://input");
        file_put_contents(__DIR__ . '/debug.log', "Input: " . $input . "\n", FILE_APPEND);
        
        $data = json_decode($input, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception("Invalid JSON input: " . json_last_error_msg());
        }

        if (!empty($data)) {
            // Read existing data
            if (file_exists($dbFile)) {
                $fileContent = file_get_contents($dbFile);
                $currentData = json_decode($fileContent, true);
                if (!is_array($currentData)) {
                    $currentData = [];
                }
            } else {
                $currentData = [];
            }

            // Add timestamp
            $data['registered_at'] = date('Y-m-d H:i:s');
            
            // Append new user
            $currentData[] = $data;

            // Save back to file
            if (file_put_contents($dbFile, json_encode($currentData, JSON_PRETTY_PRINT))) {
                http_response_code(201);
                echo json_encode(["message" => "User registered successfully.", "user" => $data]);
            } else {
                throw new Exception("Unable to write to database.json. Check permissions on " . $dbFile);
            }
        } else {
            http_response_code(400);
            echo json_encode(["message" => "Data is incomplete."]);
        }
    } elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && $action === 'login') {
        echo json_encode(["message" => "Login endpoint ready."]);
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Endpoint not found or invalid method."]);
    }
} catch (Exception $e) {
    http_response_code(500);
    file_put_contents(__DIR__ . '/debug.log', "Error: " . $e->getMessage() . "\n", FILE_APPEND);
    echo json_encode(["message" => "Server Error: " . $e->getMessage()]);
}
?>
