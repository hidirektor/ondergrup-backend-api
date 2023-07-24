<?php
$servername = "89.252.138.99";
$database = "hidirekt_ondergrup";
$username = "hidirekt_onder";
$password = "!pRk4)_?YowW";

$usernameParam = isset($_GET['username']) ? $_GET['username'] : '';
$passwordParam = isset($_GET['password']) ? $_GET['password'] : '';

if (empty($usernameParam) || empty($passwordParam)) {
    die("Kullanıcı adı veya şifre eksik!");
}

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}

$sql = "SELECT * FROM Users WHERE UserID = '$usernameParam' AND Password = '$passwordParam'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "Giriş başarılı!";
} else {
    echo "Giriş başarısız!";
}

$conn->close();
?>
