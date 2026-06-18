# Technisches Briefing: GitHub → All-Inkl Deployment

Dieses Briefing erklärt wie Websites mit GitHub verbunden und automatisch zu All-Inkl hochgeladen werden.
Inhalt, Design und Texte der neuen Website werden separat besprochen.

---

## Hosting: All-Inkl

- FTP-Server: `w01b0db8.kasserver.com`
- FTP-Zugangsdaten sind als GitHub Secrets hinterlegt:
  - `FTP_USERNAME`
  - `FTP_PASSWORT` (deutsch geschrieben!)
- Jede Domain hat einen eigenen Ordner auf dem Server, z.B. `/timoheinz.com/`
- Für eine neue Website: neuen Domain-Ordner in All-Inkl anlegen, Pfad entsprechend verwenden
- SSL: wird im All-Inkl KAS-Panel aktiviert ("SSL erzwingen: Ja", "HSTS: Ja") — NICHT per .htaccess

## GitHub

- Account: `derhypnotiseurofficial-ctrl`
- Pro Website ein eigenes Repository
- Authentifizierung: GitHub CLI (`gh`) mit HTTPS

## Auto-Deploy: bei jedem Push geht die Website automatisch online

Datei `.github/workflows/deploy.yml` im Repository anlegen:

```yaml
name: Deploy zu All-Inkl
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: w01b0db8.kasserver.com
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORT }}
          server-dir: /DOMAINORDNER/
          exclude: |
            **/.git*
            **/.git*/**
            **/node_modules/**
            .claude/**
```

`server-dir` muss für jede neue Website auf den richtigen Ordnernamen angepasst werden.

## Kontaktformular (kostenlos, ohne Limit)

Kein Drittanbieter. Eigenes PHP-Skript (`contact.php`) direkt auf All-Inkl.
All-Inkl unterstützt PHP nativ, die `mail()` Funktion funktioniert ohne weitere Einrichtung.
E-Mails landen direkt in der Gmail-Adresse des Kunden.

## Checkliste für jede neue Website

- [ ] Neues GitHub-Repository anlegen
- [ ] Neuen Domain-Ordner in All-Inkl anlegen
- [ ] `server-dir` in `deploy.yml` auf neuen Ordner setzen
- [ ] SSL im All-Inkl KAS-Panel aktivieren
- [ ] In `contact.php` die Ziel-E-Mail-Adresse eintragen
