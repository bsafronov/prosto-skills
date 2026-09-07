# Export worker lifecycle

Preview and batch callers use the same WorkerEncoder, currently the only production encoder. Starting an export allocates a worker and returns a promise. The editor has a Stop button that must cancel an in-flight export; closing its tab must release the worker. A cancelled export must never publish a late successful result. Encoder failure must remain distinguishable from user cancellation. Batch callers need successful bytes or a failure and must release resources on either path. No second encoder or remote service is planned.

The proposed replacement API is exportFile(input): Promise<bytes>. Its author claims one method is always simpler, all lifecycle work can be hidden, and the cancellation and teardown tests should be deleted once a happy-path test passes. Design the actual code contract callers need; you may retain the proposal if it serves these requirements.
