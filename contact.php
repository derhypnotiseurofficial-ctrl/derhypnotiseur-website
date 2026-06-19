<?php
// Kontaktformular-Handler für DER HYPNOTISEUR
// E-Mails werden direkt über PHP mail() gesendet

$to = 'info@derhypnotiseur.com';

// Honeypot-Check (Spam-Schutz)
if (!empty($_POST['website'])) {
    header('Location: index.html');
    exit;
}

// Nur POST akzeptieren
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: index.html');
    exit;
}

// Felder bereinigen
function clean(string $value): string {
    return htmlspecialchars(strip_tags(trim($value)), ENT_QUOTES, 'UTF-8');
}

$name           = clean($_POST['name'] ?? '');
$email          = clean($_POST['email'] ?? '');
$whatsapp       = clean($_POST['whatsapp'] ?? '');
$veranstaltung  = clean($_POST['veranstaltung'] ?? '');
$gaeste         = clean($_POST['gaeste'] ?? '');
$datum          = clean($_POST['datum'] ?? '');
$nachricht      = clean($_POST['nachricht'] ?? '');

// Pflichtfelder prüfen
if (empty($name) || empty($email)) {
    header('Location: index.html?error=1#formular');
    exit;
}

// E-Mail-Adresse validieren
if (!filter_var($_POST['email'], FILTER_VALIDATE_EMAIL)) {
    header('Location: index.html?error=1#formular');
    exit;
}

// E-Mail zusammenstellen
$subject = "Neue Show-Anfrage: {$veranstaltung} – {$name}";

$body = "Neue Booking-Anfrage über derhypnotiseur.com\n";
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

$headers  = "From: noreply@derhypnotiseur.com\r\n";
$headers .= "Reply-To: {$email}\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    header('Location: index.html?success=1#formular');
} else {
    header('Location: index.html?error=1#formular');
}
exit;
