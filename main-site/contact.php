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
$whatsapp      = clean($_POST['whatsapp'] ?? '');
$gaeste        = clean($_POST['gaeste'] ?? '');
$veranstaltung = clean($_POST['veranstaltung'] ?? '');
$datum         = clean($_POST['datum'] ?? '');
$nachricht     = clean($_POST['nachricht'] ?? '');
$ausbildung    = !empty($_POST['ausbildung']);
$paket         = clean($_POST['paket'] ?? '');
$motivation    = clean($_POST['motivation'] ?? '');

if (empty($name) || empty($email)) {
    http_response_code(400);
    exit;
}

if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit;
}

if ($ausbildung) {
    $paket_label = match($paket) {
        'einzelausbildung'  => 'Einzelausbildung (1:1)',
        'gruppenausbildung' => 'Gruppenausbildung',
        'beides'            => 'Beides / Offen',
        default             => 'Keine Angabe',
    };
    $subject = "Ausbildungsanfrage Showhypnotiseur – {$name}";
    $body  = "Neue Ausbildungsanfrage über derhypnotiseur.com\n";
    $body .= str_repeat('=', 50) . "\n\n";
    $body .= "Name:       {$name}\n";
    $body .= "E-Mail:     {$email}\n";
    $body .= "WhatsApp:   {$whatsapp}\n";
    $body .= "Paket:      {$paket_label}\n\n";
    $body .= "Motivation:\n{$motivation}\n\n";
    $body .= str_repeat('-', 50) . "\n";
    $body .= "Gesendet: " . date('d.m.Y H:i') . "\n";
} else {
    $subject = "Neue Show-Anfrage: {$veranstaltung} – {$name}";
    $body  = "Neue Booking-Anfrage über derhypnotiseur.com\n";
    $body .= str_repeat('=', 50) . "\n\n";
    $body .= "Name:           {$name}\n";
    $body .= "E-Mail:         {$email}\n";
    $body .= "WhatsApp:       {$whatsapp}\n";
    $body .= "Veranstaltung:  {$veranstaltung}\n";
    $body .= "Gästezahl:      {$gaeste}\n";
    $body .= "Datum:          {$datum}\n\n";
    $body .= "Nachricht:\n{$nachricht}\n\n";
    $body .= str_repeat('-', 50) . "\n";
    $body .= "Gesendet: " . date('d.m.Y H:i') . "\n";
}

$headers  = "From: noreply@derhypnotiseur.com\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = mail($to, $subject, $body, $headers);

http_response_code($sent ? 200 : 500);
exit;
