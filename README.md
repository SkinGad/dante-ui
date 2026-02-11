# Install

```shell
apt update && apt install dante-server
```
```shell
cat <<EOF> /etc/danted.conf
logoutput: /var/log/danted.log
internal: 0.0.0.0 port = 1080
external: eth0
user.privileged: root
user.unprivileged: nobody
user.libwrap: nobody

socksmethod: pam

client pass {
    from: 0.0.0.0/0 to: 0.0.0.0/0
    log: connect disconnect error
}

socks pass {
    from: 0.0.0.0/0 to: 0.0.0.0/0
    log: connect disconnect error
    protocol: tcp udp
}
EOF
```
```shell
cat <<EOF> /etc/pam.d/socks
auth    required   pam_exec.so expose_authtok /bin/pam-socks.py
account required pam_permit.so
EOF
```
```shell
cat <<EOF> /etc/systemd/system/dante-ui.service
[Unit]
Description=Dante UI
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
Group=root
Restart=on-failure
RestartSec=5s
StartLimitIntervalSec=60
StartLimitBurst=3

WorkingDirectory=/opt/dante-ui
ExecStart=/opt/dante-ui/dante-ui
StandardOutput=journal
StandardError=journal
SyslogIdentifier=dante

[Install]
WantedBy=multi-user.target
EOF
```
