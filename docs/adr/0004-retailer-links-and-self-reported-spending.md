# ADR 0004: Use retailer links and self-reported spending

- Status: Accepted

## Context

FitFuel has no approved retailer ordering or payment provider account. The UI needs to help users find groceries and show useful spending history without claiming that an external checkout has occurred.

## Decision

Keep the shopping list in browser local storage until the user clears it. Show retailer product-search links. Offer rough estimates from matched public Kroger listings when available. Let users record an amount after shopping and store that receipt note in private Supabase Storage.

## Consequences

- Clicking a store link does not transfer the list into a retailer cart or confirm a purchase. Users complete checkout on the retailer's site.
- Price estimates can be unavailable or differ by location, package size, tax, and delivery fees.
- Dashboard spending is based on user-entered receipt notes, not verified financial transactions. The shopping list is local to a browser and may be lost if browser storage is cleared.
