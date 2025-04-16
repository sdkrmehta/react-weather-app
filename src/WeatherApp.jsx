import SearchBox from "./SearchBox";
import InfoBox from "./InfoBox";
import { useState, useEffect } from "react";
import "./WeatherApp.css";

export default function WeatherApp() {
	const [weatherInfo, setWeatherInfo] = useState({
		city: "Wonderland",
		temp: 54,
		tempMin: 52,
		tempMax: 57,
		feelsLike: 24.84,
		humidity: 90,
		weather: "haze",
	});

	let updateInfo = (newInfo) => {
		setWeatherInfo(newInfo);
	};

	useEffect(() => {
		const body = document.body;
		const month = new Date().getMonth();

		if (month >= 2 && month <= 4) body.className = "spring";
		else if (month >= 5 && month <= 7) body.className = "summer";
		else if (month >= 8 && month <= 10) body.className = "autumn";
		else body.className = "winter";
	}, [weatherInfo]);

	return (
		<div className="container">
			<h2>Weather App</h2>
			<SearchBox updateInfo={updateInfo} />
			<InfoBox info={weatherInfo} />
		</div>
	);
}
