#!/usr/bin/env python3
"""Writes the Discord app's client ID, client secret and the verified role ID into
/etc/mistbound-account.env. Reads three lines from stdin (never from the command line, so the
secret does not show up in process lists or shell history) and prints nothing secret.
Run by account/configure-discord.sh over ssh; the service is restarted afterwards."""
import os, re, sys

PATH = os.environ.get('MB_ACCOUNT_ENV', '/etc/mistbound-account.env')
lines = sys.stdin.read().split('\n')
if len(lines) < 3:
    sys.exit('need three lines: client id, client secret, role id')
client_id, secret, role = (line.strip() for line in lines[:3])
if not re.fullmatch(r'\d{15,22}', client_id):
    sys.exit('client id must be 15-22 digits')
if not re.fullmatch(r'\d{15,22}', role):
    sys.exit('role id must be 15-22 digits')
if not re.fullmatch(r'[A-Za-z0-9_-]{16,128}', secret):
    sys.exit('client secret does not look like a Discord client secret')

text = open(PATH, encoding='utf8').read()
for key, value in (('DISCORD_CLIENT_ID', client_id), ('DISCORD_CLIENT_SECRET', secret), ('DISCORD_ROLE_ID', role)):
    text, count = re.subn(rf'(?m)^{key}=.*$', lambda _: f'{key}={value}', text)
    if not count:
        text += f'{key}={value}\n'
tmp = PATH + '.tmp'
with open(os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_TRUNC, 0o600), 'w', encoding='utf8') as handle:
    handle.write(text)
os.replace(tmp, PATH)
print('discord settings written')
