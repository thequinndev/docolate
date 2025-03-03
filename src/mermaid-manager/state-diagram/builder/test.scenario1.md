```mermaid
stateDiagram-v2
    A: Entity A
    B: Entity B
    C: Entity C
    [*] --> A
    A --> B
    B --> C
    C --> A: Back to A
```