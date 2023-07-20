$(document).ready(function () {
  const apikey = "76743047aa4fac8fb23eaabc21a64a62";
  const url = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

  $(".country").hide();

  async function countryname(searchChar) {
    try {
      const response = await $.ajax({
        url: "json/country.json",
        type: "GET",
        dataType: "json",
      });

      const matchingCountries = response.filter((item) =>
        item.country.toLowerCase().includes(searchChar.toLowerCase())
      );

      if (matchingCountries.length > 0) {
        $(".country").empty();
        for (let i = 0; i < matchingCountries.length; i++) {
          const searchcountry = $("<button>")
            .addClass("searchcountry")
            .text(matchingCountries[i].country);
          $(searchcountry).on("click", function () {
            const selectedCountry = matchingCountries[i].country;
            $("#search").val(selectedCountry);
            weather(selectedCountry)
          });
          $(".country").append(searchcountry);
        }
        $(".country").show();
      } else {
        throw new Error("No matching countries found");
      }
    } catch (error) {
      $(".country").hide();
    }
  }

  const cityvalue = $("#search");
  $(".search").on("keyup", async () => {
    const searchChar = cityvalue.val();
    if (searchChar.length > 0) {
      await countryname(searchChar);
    }
    else {
      $(".country").hide();
    }

  });


  $(".search-btn").on("click", async () => {
    $(".country").hide();
    const city = cityvalue.val().toLowerCase();
    await countryname(city);
    if (countryname(city)) {
      weather(city)
    }
  });

  function weather(city) {
    $(".country").hide();
    $.ajax({
      url: url + city + `&appid=${apikey}`,
      type: "GET",
      dataType: "json",
      success: function (data) {
        $(".city").text(data.name);
        $(".temp").text(Math.round(data.main.temp) + "°C");
        $(".humidity-percent").text(data.main.humidity + "%");
        $(".wind-percent").text(data.wind.speed + " km/h");
        if (data.weather[0].main === "Clouds") {
          $(".weather-icon").attr("src", "images/clouds.png");
        } else if (data.weather[0].main === "Clear") {
          $(".weather-icon").attr("src", "images/clear.png");
        } else if (data.weather[0].main === "Rain") {
          $(".weather-icon").attr("src", "images/rain.png");
        } else if (data.weather[0].main === "Drizzle") {
          $(".weather-icon").attr("src", "images/drizzle.png");
        } else if (data.weather[0].main === "Mist") {
          $(".weather-icon").attr("src", "images/mist.png");
        }
      },
      error: function (xhr, status, error) {
        console.log(xhr);
        alert("Error fetching weather data.");
      },
    });
  }
});