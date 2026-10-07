# Architecture decision records

An ADR explains a significant technical choice: the problem, the decision, and its consequences. These records describe the current implementation, not a claim that every production concern has been resolved. Update an ADR or add a new one when a decision changes.

| ADR | Decision |
| --- | --- |
| [0001](0001-separate-web-and-api.md) | Run Next.js and NestJS as separate services |
| [0002](0002-supabase-data-and-application-auth.md) | Keep application auth in NestJS and use Supabase for data |
| [0003](0003-gemini-for-active-diet-generation.md) | Use Gemini for the active diet generator |
| [0004](0004-retailer-links-and-self-reported-spending.md) | Use retailer search links and self-reported spending |

Each ADR uses **Status**, **Context**, **Decision**, and **Consequences**. “Accepted” means the application currently follows the decision; it does not imply a security or clinical review.
