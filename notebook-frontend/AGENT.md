⠶ Here's a better structure for your documentation comments:

    // Component: SourceModal
    // Purpose: Modal for adding different source types to chat
    // 
    // Interactions:
    //   - Open: Click "Add Source" button in sidebar
    //   - Main view: 4 options (YouTube, PDF, VVT, Copied Text)
    //   - Sub-views: YouTube URL input, Textarea input
    //   - Close: X button, cancel, or successful submission
    //
    // State:
    //   - sources[] - list of added sources (youtube, pdf, vvt, text)
    //   - currentView - "main" | "youtube" | "copiedText"
    //
    // Dependencies:
    //   - Uses: Dialog, Button, Input, Textarea from shadcn
    //   - Calls: onSourceAdded callback when source is added

    // Component: ChatPage  
    // Purpose: Chat interface that uses uploaded sources
    //
    // States:
    //   - No sources: Show Empty component with message
    //   - Has sources: Show MessageScroller with Bubble components
    //
    // Props:
    //   - sources: Source[] - list of active sources
    //
    // UI Pattern:
    //   - Header: Marker showing active sources
    //   - Body: MessageScroller > BubbleGroup > Bubble
    //   - Footer: Input + Send button

  Key improvements:

  1. Use structured headers - // Component:, // Purpose:, // Interactions:
  2. Be explicit about flows - what triggers what, state transitions
  3. List dependencies - which UI components you want to use
  4. Define states clearly - empty, loading, error, success states
  5. Include edge cases - what happens if nothing is uploaded? empty?

  This format helps me understand not just what but how it should work, including the expected
  behavior and component composition.