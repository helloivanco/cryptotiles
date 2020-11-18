import { useEffect, useState } from "react";

import Badge from "react-bootstrap/Badge";
import * as dayjs from "dayjs";

import CoinGecko from "coingecko-api";
const coinGeckoClient = new CoinGecko();

export default function Comparison( props ) {
	const {
		base,
		baseSymbol,
		current,
		currentSymbol,
		priceBase,
		priceCurrent
	} = props;

	const [data, setData] = useState( [] );
	const [dataBase, setDataBase] = useState( [] );

	const fetchHistory = async ( coinId, dateRange ) => {
		const historicPrice = await coinGeckoClient
			.coins
			.fetchHistory( coinId, { date: dateRange } );

		return historicPrice.data.market_data.current_price.usd;
	}

	const change = ( now, past ) => {
		return ( now - past ) / past
	}

	async function gecko( i ) {

		let dateRange = dayjs()
			.subtract( i, "day" )
			.format( "DD-MM-YYYY" );

		const b = await fetchHistory( base, dateRange );
		const t = await fetchHistory( current, dateRange );

		const bNow = priceBase;
		const tNow = priceCurrent;

		let changeCurrentBase = ( 1 + change( tNow, t ) ) / ( 1 + change( bNow, b ) )
		let percentChange = 100 * ( changeCurrentBase - 1 )

		setData( result => [
			percentChange.toFixed( 2 ), ...result
		] );

		// Base Change in relation to USD
		let usdPercentChange = 100 * change( bNow, b )
		setDataBase( result => [
			usdPercentChange.toFixed( 2 ), ...result
		] )

	}

	useEffect( () => {

		async function runLoop() {
			let ranges = [ 1, 7, 30, 60 ];

			for ( const range of ranges ) {
				await gecko( range );
			}

		}

		runLoop();

	}, [ base, current ] );

	return ( <div className="mt-3">
		{
			base == current
				? ( <div>
					<h5>
						<Badge pill="pill" variant="primary">
							Selected Base: {baseSymbol.toUpperCase()}
						</Badge>
					</h5>
					<p>day {dataBase[ 3 ]}%</p>
					<p>week {dataBase[ 2 ]}%</p>
					<p>month {dataBase[ 1 ]}%</p>
					<p>2 months {dataBase[ 0 ]}%</p>
				</div> )
				: ( <div>
					<h5>
						<Badge pill="pill" variant="light">
							{currentSymbol.toUpperCase()}{' '}/ {baseSymbol.toUpperCase()}
						</Badge>
					</h5>
					<p>day {data[ 3 ]}%</p>
					<p>week {data[ 2 ]}%</p>
					<p>month {data[ 1 ]}%</p>
					<p>2 months {data[ 0 ]}%</p>

				</div> )
		}
	</div> );
}
