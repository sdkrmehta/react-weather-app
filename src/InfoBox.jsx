import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import "./InfoBox.css";

export default function InfoBox({ info }) {
	let imageURL = "";

	if (info.temp > 30) {
		imageURL =
			"https://images.unsplash.com/uploads/14121010130570e22bcdf/e1730efe?w=600&auto=format&fit=crop&q=60"; // Summer
	} else if (info.temp < 20) {
		imageURL =
			"https://images.pexels.com/photos/1438761/pexels-photo-1438761.jpeg?auto=compress&cs=tinysrgb&w=600"; // Winter
	} else if (info.humidity > 80) {
		imageURL =
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKY0XyXSYbhD3shVzGtTdD9ZhS8fD90un2wQ&s"; // Rainy
	} else {
		imageURL =
			"https://plus.unsplash.com/premium_photo-1674917070243-905c3bbf1576?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c3ByaW5nfGVufDB8fDB8fHww"; // Spring
	}

	return (
		<div className="InfoBox">
			<Card
				sx={{
					width: "100%",
					maxWidth: 350,
					margin: "20px auto",
					padding: "20px",
					borderRadius: "20px",
					boxShadow: "0 12px 30px rgba(0, 0, 0, 0.1)",
					textAlign: "center",
				}}
			>
				<Typography
					variant="h5"
					sx={{ fontWeight: 600, color: "#2c3e50", mb: 2 }}
				>
					{info.city}
				</Typography>

				<img src={imageURL} alt="weather" className="weather-image" />

				<Typography
					variant="h6"
					sx={{ fontWeight: 600, color: "#34495e", mb: 1 }}
				>
					Temperature = {info.temp}°C
				</Typography>

				<Typography sx={{ color: "#555" }}>
					Humidity = {info.humidity}%
				</Typography>
				<Typography sx={{ color: "#555" }}>
					Min Temperature = {info.tempMin}°C
				</Typography>
				<Typography sx={{ color: "#555" }}>
					Max Temperature = {info.tempMax}°C
				</Typography>

				<Typography sx={{ mt: 2, color: "#555" }}>
					The weather can be described as{" "}
					<i>
						<b style={{ color: "#2c3e50" }}>{info.weather}</b>
					</i>{" "}
					and feels like {info.feelsLike}°C
				</Typography>
			</Card>
		</div>
	);
}
