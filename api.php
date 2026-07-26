<?php
header("Content-Type: application/json");

$username = $_GET['user'] ?? '';

if (empty($username)) {
    echo json_encode(["error" => "Username required"]);
    exit;
}

// Username → User ID
$ch = curl_init("https://users.roblox.com/v1/usernames/users");
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json"
    ],
    CURLOPT_POSTFIELDS => json_encode([
        "usernames" => [$username],
        "excludeBannedUsers" => false
    ])
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response, true);

if (empty($data["data"][0])) {
    echo json_encode(["error" => "User not found"]);
    exit;
}

$user = $data["data"][0];

// Avatar
$avatar = json_decode(file_get_contents(
    "https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds={$user['id']}&size=420x420&format=Png&isCircular=false"
), true);

$image = $avatar["data"][0]["imageUrl"] ?? "";

echo json_encode([
    "id" => $user["id"],
    "name" => $user["displayName"],
    "username" => $user["name"],
    "imageUrl" => $image
]);