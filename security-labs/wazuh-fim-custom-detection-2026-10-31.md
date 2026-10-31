# Wazuh Custom FIM Detection — Verified Lab Case Study

**Test date:** 2026-10-31 (UTC)  
**Platform:** Wazuh 4.14.5, macOS endpoint agent, Wazuh manager in OrbStack  
**Classification:** Authorised security simulation (benign positive)  
**Status:** Custom rule detection verified; broader threat hunting remains in progress.

## Objective
Validate that a custom Wazuh rule produces a higher-priority alert when an authorised test file is modified.

## Detection logic
- Built-in parent detection: Wazuh rule **550** (integrity checksum changed).
- Custom child rule: **100550**.
- Severity: **10**.
- Match target: the controlled lab test file under `soc-fim-lab/test-alert.txt`.
- Associated MITRE ATT&CK technique: **T1565.001 — Stored Data Manipulation**. This mapping is a detection label, not proof of malicious activity.

## Confirmed observations
- Rule configuration validation: `wazuh-analysisd -t` exited with status **0**.
- Wazuh manager restarted and reported **active**.
- Controlled file modification was performed on the macOS endpoint.
- New alert timestamp: **2026-10-31T13:11:25.757+0000**.
- Matched rule ID: **100550**.
- Alert severity: **10**.
- Syscheck event: **modified**.
- The alert was exported to a JSON evidence file and JSON validation passed.
- A separate sanitised summary was generated locally and confirmed by the terminal message `Sanitised summary created successfully`.

## Sanitised detection summary

```json
{
  "timestamp": "2026-10-31T13:11:25.757+0000",
  "rule_id": "100550",
  "severity": 10,
  "event": "modified",
  "classification": "Authorised security simulation",
  "detection_status": "Successful"
}
```

## Investigation assessment
The custom rule successfully detected an expected, controlled file modification. The finding is **benign positive**, not a confirmed attack. This test establishes the operation of one targeted detection rule; it does not establish system-wide absence of malicious activity.

## Evidence handling
The original full alert and sanitised JSON summary are held locally in the Wazuh VM. The full original alert is intentionally **not committed** here to avoid exposing usernames, endpoint file paths or other environment metadata.

## Follow-up
1. Review additional FIM alerts and record hunting scope and time window.
2. Confirm the final custom rule contents match the tested rule.
3. Return any temporarily reduced FIM scan interval to the intended operational value after testing.
4. Record further validated hunting findings separately; do not label untested detections as verified.
