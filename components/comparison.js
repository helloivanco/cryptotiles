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

		if ( historicPrice.hasOwnProperty( 'data' ) ) {
			if ( historicPrice.data.hasOwnProperty( 'market_data' ) ) {
				return historicPrice.data.market_data.current_price.usd;
			}
		}

		return 0
	}

	const change = ( now, past ) => {
		return ( now - past ) / past
	}

	const displayNA = ( percent ) => {
		if ( percent == 0 || percent == 100 || percent == -100 ) {
			return 'NA'
		} else {
			return percent
		}
	}

	async function gecko( i ) {

		let dateRange = dayjs()
			.subtract( i, "day" )
			.format( "DD-MM-YYYY" );

		const b = await fetchHistory( base, dateRange );
		const t = await fetchHistory( current, dateRange );

		const bNow = priceBase;
		const tNow = priceCurrent;

		// Only process for base and contains sufficient data
		if ( b != 0 && baseSymbol == currentSymbol ) {
			// Base Change in relation to USD
			let usdPercentChange = 100 * change( bNow, b )
			setDataBase( result => [
				usdPercentChange.toFixed( 2 ), ...result
			] )
		} else {
			setDataBase( result => [
				0, ...result
			] )
		}

		// Check if sufficient data of current
		if ( t == 0 ) {
			setData( result => [
				0, ...result
			] );
		} else {
			let changeCurrentBase = ( 1 + change( tNow, t ) ) / ( 1 + change( bNow, b ) )
			let percentChange = 100 * ( changeCurrentBase - 1 )

			setData( result => [
				percentChange.toFixed( 2 ), ...result
			] );

		}

	}

	useEffect( () => {

		async function runLoop() {
			let ranges = [
				1,
				7,
				30,
				90,
				180,
				270,
				360
			];

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
							{baseSymbol.toUpperCase()}{' '}
							Selected
						</Badge>
					</h5>
					<p>day {displayNA( dataBase[ 6 ] )}%</p>
					<p>week {displayNA( dataBase[ 5 ] )}%</p>
					<p>1 month {displayNA( dataBase[ 4 ] )}%</p>
					<p>3 months {displayNA( dataBase[ 3 ] )}%</p>
					<p>6 months {displayNA( dataBase[ 2 ] )}%</p>
					<p>9 months {displayNA( dataBase[ 1 ] )}%</p>
					<p>year {displayNA( dataBase[ 0 ] )}%</p>
				</div> )
				: ( <div>
					<h5>
						<Badge pill="pill" variant="light">
							{currentSymbol.toUpperCase()}{' '}/ {baseSymbol.toUpperCase()}
						</Badge>
					</h5>
					<p>day {displayNA( data[ 6 ] )}%</p>
					<p>week {displayNA( data[ 5 ] )}%</p>
					<p>1 month {displayNA( data[ 4 ] )}%</p>
					<p>3 months {displayNA( data[ 3 ] )}%</p>
					<p>6 months {displayNA( data[ 2 ] )}%</p>
					<p>9 months {displayNA( data[ 1 ] )}%</p>
					<p>year {displayNA( data[ 0 ] )}%</p>

				</div> )
		}
	</div> );
}
