<?php
$servername = "89.252.138.99";
$database = "hidirekt_ondergrup";
$username = "hidirekt_onder";
$password = "!pRk4)_?YowW";

$usernameParam = isset($_GET['username']) ? $_GET['username'] : '';
$emailParam = isset($_GET['email']) ? $_GET['email'] : '';
$passwordParam = isset($_GET['password']) ? $_GET['password'] : '';

if (empty($usernameParam) || empty($emailParam) || empty($passwordParam)) {
    die("Kullanıcı adı, e-posta veya şifre eksik!");
}

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Bağlantı hatası: " . $conn->connect_error);
}

$sql = "SELECT * FROM Users WHERE UserID = '$usernameParam' OR Email = '$emailParam'";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "Bu UserID veya e-posta zaten kullanılıyor!";
} else {
    $hashedPassword = $passwordParam;
    $insertSql = "INSERT INTO Users (UserType, UserID, Email, Password, NameSurname, CompanyName, Phone) VALUES ('NORMAL', '$usernameParam', '$emailParam', '$hashedPassword', 'NaN', 'NaN', 'NaN')";
    if ($conn->query($insertSql) === TRUE) {
        echo "Kullanıcı başarıyla kaydedildi!";
    } else {
        echo "Kullanıcı kaydedilemedi!";
    }
}

$conn->close();
?>
