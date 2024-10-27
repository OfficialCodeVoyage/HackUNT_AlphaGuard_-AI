# AlphaGuard AI

## Inspiration
Almost everyone knows someone who has been scammed by a phone call or spam message. The panic and distress it causes can be heartbreaking, especially when it happens to a loved one. With **AlphaGuard AI**, we aim to end this. Whether for you, your family, or your community, **AlphaGuard AI** stands as the first line of defense in today’s increasingly complex world of digital deception. With **AlphaGuard AI**, you’ll always be one step ahead, empowered and protected.

## What it does
**AlphaGuard AI** is a real-time scam detection solution that monitors phone calls in 10-second intervals, listening for high-risk "stop words" like “buy a gift card” or “don’t hang up.” When these phrases are detected, AlphaGuard AI raises the confidence level of a potential scam based on the severity of the words used. Once this confidence reaches a set threshold, the call is automatically terminated to protect the user. Following the call, AlphaGuard AI educates users about the scam they encountered and provides tips to help them recognize and avoid similar schemes in the future.

## How we built it
AlphaGuard AI operates in two main layers:
1. **Layer 1:** It first verifies the incoming phone number by checking it against a list of known scam numbers stored in a database. If the number is flagged as suspicious, the AI prepares to analyze the content of the call.
2. **Layer 2:** Using Twilio and Grok for call handling, we capture real-time call audio in 10-second intervals. Audio transcriptions are generated via Azure OpenAI and processed by our trained NLP model. The NLP model, developed with Flask and Django, identifies "stop words" associated with common scams. When a call reaches a high-risk threshold based on flagged phrases, it’s immediately terminated.

After a flagged call, the user receives a post-call notification, with educational resources explaining the specific scam, key indicators, and strategies for future avoidance. The educational system uses pre-recorded messages, customized based on the type of scam detected.

## Challenges we ran into
Integrating voice-to-text functionality was a primary challenge, especially on iOS, where we had limited access to audio permissions. This led us to develop and test the system on Android, which allowed more flexible audio handling. We also had to carefully fine-tune our NLP model for accuracy, using stop words with Python and Azure’s language processing.

## Accomplishments that we're proud of
- **Real-Time Detection**: Achieved seamless real-time detection and call termination upon identifying high-risk indicators.
- **Cross-Layer Protection**: Successfully implemented dual-layer analysis for scam detection and user protection.
- **Educational Impact**: Created an educational post-call feature, helping users understand and avoid similar scams.

## What we learned
- **Nick** learned new techniques in Flask for handling real-time data and explored Android Studio to surpass the permissions issue faced. "Do not use Django."
- **Asmitha** enhanced her understanding of Vercel and Next.js for modifying web applications and building RESTful APIs or handling webhooks in a Node.js application.
- **Pavlo** gained knowledge in utilizing Azure OpenAI for processing call data and creating AI models specific to detecting scam patterns.
- **Darshan** expanded his skills in Django for managing user data effectively and Next.js for creating responsive web applications effectively .

## What's next for AlphaGuard AI
Currently, the program is hosted locally. We plan to deploy it on the cloud for broader accessibility and scalability. Additional future enhancements include:
- **Enhanced Language Model Training**: Improving the accuracy and sensitivity of scam detection by training on a more extensive dataset.
- **iOS Compatibility**: Exploring workarounds to integrate AlphaGuard AI fully with iOS devices.
- **Advanced AI Scoring**: Implementing a second layer of AI that continuously monitors and scores the likelihood of scam activity on the caller’s end.
- **User Notifications**: Providing real-time alerts and summaries for users during risky interactions.

With these improvements, AlphaGuard AI will offer even stronger protection for users against evolving scams worldwide.
