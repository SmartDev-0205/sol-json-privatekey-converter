import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import fs from 'fs';

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function summarizeInvestors(investors) {
    const summary = {};

    investors.forEach(investor => {
        if (summary[investor.address]) {
            // If the address already exists, add the amount
            summary[investor.address] += investor.amount;
        } else {
            // Otherwise, initialize the address with its amount
            summary[investor.address] = investor.amount;
        }
    });

    // Convert the summary object back into an array format
    return Object.entries(summary).map(([address, amount]) => ({
        address,
        amount
    }));
}

async function trackIncomeTransactions(walletAddress) {
    console.log("Running track function------------------");
    let csvData = "Wallet Address,Token Amount\n";
    const connection = new Connection(
        "https://api.mainnet-beta.solana.com",
        "confirmed"
    );
    const publicKey = new PublicKey(walletAddress);
    const signatures = await connection.getConfirmedSignaturesForAddress2(
        publicKey,
    );
    let before = undefined;
    let allSignatures = [];
    let allInvestors = [];
    let totalAmount = 0;
    // Fetch the recent transactions for the wallet
    try {
        while (true) {
            const signatures = await connection.getConfirmedSignaturesForAddress2(
                publicKey,
                {
                    limit: 100, // Max limit per request
                    before: before, // Use the 'before' parameter for pagination
                }
            );

            if (signatures.length === 0) {
                break; // Exit the loop if no more signatures are returned
            }

            allSignatures.push(...signatures);
            before = signatures[signatures.length - 1].signature; // Update 'before' to the last signature for the next batch
            console.log("Fetched", signatures.length, "signatures");
        }
        for (let i = 0; i < allSignatures.length; i++) {

            let signatureInfo = signatures[i];
            try {
                const transaction = await connection.getParsedTransaction(
                    signatureInfo.signature,
                    { maxSupportedTransactionVersion: 0 }
                );
                let transactionIncome = false;
                let amount = 0;
                let senderAddress = "";

                // Check each transaction to see if it's an income transaction
                for (let instruction of transaction.transaction.message.instructions) {
                    if (
                        instruction.parsed &&
                        instruction.parsed.type === "transfer" &&
                        instruction.parsed.info.destination === walletAddress
                    ) {
                        transactionIncome = true;
                        amount = instruction.parsed.info.lamports;
                        senderAddress = instruction.parsed.info.source;
                        break; // Assuming only one income transfer per transaction for simplicity
                    }
                }

                if (transactionIncome) {
                    console.log("senderAddress:", senderAddress);
                    console.log(`Income Transaction Found: ${signatureInfo.signature}`);
                    console.log(`Amount: ${amount / 1e9} lamports`);
                    totalAmount += amount / 1e9;
                    if (amount > 0) {
                        allInvestors.push({
                            address: senderAddress,
                            amount: 50 * amount / 100
                        })
                    }


                }

                await sleep(5000);

            } catch (error) {
                sleep(10000);
                i = i - 1;
            }

        }

        for (let investor of summarizeInvestors(allInvestors)) {
            csvData += `${investor.address},${investor.amount}\n`;
        }
        console.log("Total ", totalAmount);
        fs.writeFileSync('income_transactions.csv', csvData);
    } catch (error) {
        console.log(error);
    }

}
trackIncomeTransactions(



    "BWck2JedKAi6fE99dvEFvgBU1RN9UukBuVo2fBjkUbra",
);
