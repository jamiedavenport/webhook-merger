# `webhook-merger`

Forwards incoming webhooks to `FORWARD_HOOK_URL`, after `TIMEOUT_SECONDS` seconds has passed since the first webhook.

Content is grouped based on the `CACHE_KEY`.