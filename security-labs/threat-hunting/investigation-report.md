# Mini SOC Lab — Threat Hunting Investigation Report

**Date:** 31 October 2026  
**Lab:** Wazuh 4.14.5 with OrbStack manager and macOS endpoint agent  
**Status:** Investigation documented; selected alerts require further follow-up.

## Executive summary

The lab successfully validated a custom Wazuh file-integrity detection rule (100550, level 10) after an authorised modification of a monitored test file. A review of the last 48 hours of available alert logs counted 54,462 alerts, with 54,347 attributed to rootcheck rule 510. Further investigation identified a high volume of virtual-filesystem warnings and two world-writable VPN log files on the macOS endpoint. The file permissions were subsequently corrected. A hidden TCP-port alert could not be reproduced during follow-up checks and remains unresolved.

## Evidence and findings

### 1. Custom file-integrity detection — verified benign positive

- Built-in FIM detection: rule **550**, level **7**.
- Tested custom detection: rule **100550**, level **10**.
- Alert timestamp: **2026-10-31T13:11:25.757+0000**.
- Event: **modified**.
- Classification: authorised security simulation, not an observed attack.
- The alert JSON was validated and a sanitised summary was created locally.
- The rule carries the MITRE ATT&CK **T1565.001** mapping; this does not establish malicious intent.

### 2. Alert volume and rootcheck investigation

The 48-hour summary returned **54,462** alerts: level 10: **1**; level 7: **54,436**; level 4: **1**; level 3: **24**.

Rule **510** appeared **54,347** times. Of these, **54,332** were assigned to the Wazuh manager (agent 000) and **15** to the macOS endpoint (agent 001). The manager messages sampled referenced paths beneath `/dev/.lxc/` and possible hidden files. A virtual/container filesystem interaction is a plausible cause of noisy rootcheck detections, but the full alert population has **not** been verified as false positives.

**Disposition:** Investigate further; do not indiscriminately suppress the rule.

### 3. TCP port 55555 warning — inconclusive

A macOS rootcheck event warned of a potentially hidden TCP port **55555**. Follow-up `lsof` and `netstat` checks on the Mac returned no matching process or connection. This reflects the state at the time of checking and does **not** conclusively invalidate the historical alert.

**Disposition:** Monitor for recurrence and capture contemporaneous process, socket, and alert context if repeated.

### 4. Pulse Secure log file permissions — remediated

Two VPN log files were observed with owner `root`, group `wheel`, and mode **0666**, permitting write access by other local users. A remediation command changed their modes to **0640**. A subsequent `ls -l` displayed **-rw-r-----** on both files.

**Disposition:** Permissions correction verified. If this VPN software is used again, validate its logging functionality and check whether the files are recreated with insecure permissions.

## Return to normal lab operation

- FIM scan interval: restored from **120 seconds** to **43,200 seconds (12 hours)**.
- A configuration backup was created.
- A diff displayed only the intended FIM frequency change.
- The Wazuh agent-specific configuration test returned **exit code 0**.
- The macOS agent restart completed and all five services reported running: modulesd, logcollector, syscheckd, agentd, and execd.

## Conclusion

The targeted custom detection worked as intended and the file-permission exposure was remediated. High-volume rootcheck messages and the historical hidden-port warning remain investigative follow-ups rather than confirmed compromises or conclusively benign events.

**Privacy:** This public report intentionally excludes personal hostnames, usernames, exact endpoint file paths, and unredacted event evidence.
