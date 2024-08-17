
# Clash of Code - Discord bot

This Discord bot allows you to create custom CodinGame’s Coding Clashes directly within your server. It automates the entire process, including round creation, leaderboard updates, and information messages.

## How to Use

### Step 1: Create a CodinGame Account for Your Bot
First, you'll need to create a new account on [CodinGame.com](https://www.codingame.com/) specifically for your bot. This account will be used to manage the clashes.

### Step 2: Use the **/create** Command
Once your bot account is set up, you can start creating Coding Clashes in your Discord server using the **/create** command.

### Command Parameters:

- **[rounds]** - The number of rounds in the tournament.
- **[languages]** - The programming languages available for the participants.
- **[mode]** - The game mode (e.g., fastest, shortest, reverse).
- **[rememberme cookie]** - Your `rememberme` cookie from the CodinGame website.
- **[CgSession cookie]** - Your `CgSession` cookie from the CodinGame website.

### Step 3: Start the Tournament
After filling in the required parameters, the bot will automatically handle the rest. It will create the rounds, manage the leaderboard, and send information messages to keep everyone updated.
## How to find cookies

You can find cookies in developer tools on your browser.

![Cookies](https://developer.chrome.com/static/docs/devtools/application/cookies/image/clearing-cookies-394c5013116ae.png)


TODO: 
- Put Combine Clash and TempClash
- Clean up the startRound function