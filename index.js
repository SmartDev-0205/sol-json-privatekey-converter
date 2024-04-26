import bs58 from 'bs58';
const Main = () => {
    const keyArray = [...]

    const pk = bs58.encode(Buffer.from(keyArray));

    console.log("Public Key:", pk);
};
Main();