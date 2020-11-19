import { useEffect, useState } from "react";

import Badge from "react-bootstrap/Badge";
import ProgressBar from "react-bootstrap/ProgressBar";

import CoinGecko from "coingecko-api";
const coinGeckoClient = new CoinGecko();

export default function Ath(props) {
  const { current, currentSymbol, priceCurrent } = props;

  const [data, setData] = useState([]);
  const [fromAth, setFromAth] = useState(0);
  const [percAth, setPercAth] = useState(0);
  const [maxSupply, setMaxSupply] = useState(0);
  const [totalSupply, setTotalSupply] = useState(0);

  useEffect(() => {
    async function coinId() {
      let coinsData = await coinGeckoClient.coins.fetch(current, {});
      console.log(coinsData);
      setData(coinsData);

      let Ath = coinsData.data.market_data.ath.usd;
      console.log({ Ath }, { priceCurrent });
      setPercAth((100 * priceCurrent) / Ath);
      setFromAth((Ath - priceCurrent) / priceCurrent);

      if (coinsData.data.market_data.hasOwnProperty("max_supply")) {
        setMaxSupply(coinsData.data.market_data.max_supply);
      }
      if (coinsData.data.market_data.hasOwnProperty("total_supply")) {
        setTotalSupply(coinsData.data.market_data.total_supply);
      }
    }

    coinId();
  }, [current]);

  return (
    <div className="mt-3 mr-5 ml-5">
      <h5>
        <Badge pill="pill" variant="light">
          Upside to ATH {fromAth.toFixed(2)}x
        </Badge>
      </h5>

      <p></p>
      <ProgressBar
        style={{ height: "22px" }}
        now={percAth}
        label={`${percAth.toFixed(1)}%`}
        variant="primary"
      />
      <div className="mt-2">
        {maxSupply ? <p>Max Supply {maxSupply}</p> : <p>.</p>}
        {totalSupply ? <p>Total Supply {totalSupply}</p> : <p>.</p>}
      </div>
    </div>
  );
}
