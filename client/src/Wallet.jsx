import server from './server';
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';
import data from './scripts/data';

function Wallet({
  privateKey,
  setPrivateKey,
  address,
  setAddress,
  balance,
  setBalance,
}) {
  async function onChange(evt) {
    const address = evt.target.value;
    let publicKey = null;
    setAddress(address);

    if (data.length > 0) {
      for (let i = 0; i < data.length; i++) {
        if (data[i].address === address) {
          publicKey = toHex(secp.recoverPublicKey(
            address,
            data[i].signature,
            data[i].recoveryBit
          ));
        }
      }
    }
    if (publicKey) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Address
        <input
          placeholder="Type an address, for example: 0x1"
          value={address}
          onChange={onChange}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
