<?php
header('Content-Type: text/plain; charset=UTF-8');

$to = 'info@derhypnotiseur.com';

// Honeypot
if (!empty($_POST['website'])) {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit;
}

function clean(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

$name          = clean($_POST['name'] ?? '');
$email         = clean($_POST['email'] ?? '');
$veranstaltung = clean($_POST['veranstaltung'] ?? '');
$datum         = clean($_POST['datum'] ?? '');
$nachricht     = clean($_POST['nachricht'] ?? '');

if (empty($name) || empty($email)) {
    http_response_code(400);
    exit;
}

if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit;
}

$subject = "Neue Show-Anfrage: {$veranstaltung} – {$name}";

$body  = "Neue Booking-Anfrage über derhypnotiseur.com\n";
$body .= str_repeat('=', 50) . "\n\n";
$body .= "Name:           {$name}\n";
$body .= "E-Mail:         {$email}\n";
$body .= "Veranstaltung:  {$veranstaltung}\n";
$body .= "Datum:          {$datum}\n\n";
$body .= "Nachricht:\n{$nachricht}\n\n";
$body .= str_repeat('-', 50) . "\n";
$body .= "Gesendet: " . date('d.m.Y H:i') . "\n";

$headers  = "From: noreply@derhypnotiseur.com\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = mail($to, $subject, $body, $headers);

http_response_code($sent ? 200 : 500);
exit;
