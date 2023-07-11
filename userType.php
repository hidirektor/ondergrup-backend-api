<?php
$servername = "89.252.138.99";
$database = "hidirekt_ondergrup";
$username = "hidirekt_onder";
$password = "!pRk4)_?YowW";

$usernameParam = $_GET['username'];

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}

$sql = "SELECT userType FROM Users WHERE UserID = '$usernameParam'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    $userType = $row['userType'];
    echo $userType;
} else {
    echo "Kullanıcı bulunamadı";
}

$conn->close();
?>