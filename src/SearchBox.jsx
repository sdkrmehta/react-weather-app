import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./SearchBox.css";
import { useState } from "react";

export default function SearchBox({ updateInfo }) {
	const [city, setCity] = useState("");
	const [error, setError] = useState(false);
	const API_URL = "https://api.openweathermap.org/data/2.5/weather?";
	const API_KEY = "c3740eccaf4c82e7e4cc7d54b5bebd41";

	let getWeatherInfo = async () => {
		try {
			let response = await fetch(
				`${API_URL}q=${city}&appid=${API_KEY}&units=metric`,
			);

			if (!response.ok) {
				throw new Error("City not found");
			}

			let result = await response.json();

			let newInfo = {
				city: result.name,
				temp: result.main.temp,
				tempMin: result.main.temp_min,
				tempMax: result.main.temp_max,
				feelsLike: result.main.feels_like,
				humidity: result.main.humidity,
				weather: result.weather[0].description,
			};
			return newInfo;
		} catch (error) {
			alert(error.message);
		}
	};

	let handleChange = (evt) => {
		setCity(evt.target.value);
		if (evt.target.value.trim() !== "") {
			setError(false);
		}
	};

	let handleSubmit = async (evt) => {
		evt.preventDefault();
		if (city.trim() === "") {
			setError(true);
			return;
		}
		let newInfo = await getWeatherInfo();
		if (newInfo) {
			updateInfo(newInfo);
			setCity("");
		}
	};

	return (
		<div className="searchBox">
			<form onSubmit={handleSubmit} className="search-form">
				<TextField
					id="city"
					label="City Name"
					variant="outlined"
					value={city}
					onChange={handleChange}
					error={error}
					helperText={error ? "*City name is required" : ""}
					fullWidth
				/>
				<Button
					variant="contained"
					type="submit"
					className="search-btn"
				>
					SEARCH
				</Button>
			</form>
		</div>
	);
}
