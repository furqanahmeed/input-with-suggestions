import React, { useState, useEffect } from "react";

const AutoSuggestion = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [userInput, setUserInput] = useState("");
  const [selectedHotelRating, setSelectedHotelRating] = useState("");

  useEffect(() => {
    fetch("/hotels.json")
      .then((response) => response.json())
      .then((data) => setSuggestions(data))
      .catch((error) => console.error("Error fetching the JSON file:", error));
  }, []);

  const onChange = (e) => {
    const userInput = e.target.value;

    const filteredSuggestions = suggestions
      .filter(
        (suggestion) =>
          suggestion.hotel_Name.toLowerCase().indexOf(userInput.toLowerCase()) >
          -1
      )
      .slice(0, 8); // Limit to the first 8 matches

    setUserInput(userInput);
    setFilteredSuggestions(filteredSuggestions);
    setActiveSuggestionIndex(0);
    setShowSuggestions(true);

    // Clear selected hotel rating when the input is emptied
    if (!userInput) {
      setSelectedHotelRating("");
    }
  };

  const onClick = (e) => {
    const selectedHotelName = e.currentTarget.innerText;
    const selectedHotel = suggestions.find(
      (suggestion) => suggestion.hotel_Name === selectedHotelName
    );
    setUserInput(selectedHotelName);
    setSelectedHotelRating(selectedHotel.rating);
    setFilteredSuggestions([]);
    setShowSuggestions(false);
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      const selectedHotel = filteredSuggestions[activeSuggestionIndex];
      setUserInput(selectedHotel.hotel_Name);
      setSelectedHotelRating(selectedHotel.rating);
      setActiveSuggestionIndex(0);
      setShowSuggestions(false);
    } else if (e.keyCode === 38) {
      if (activeSuggestionIndex === 0) {
        return;
      }
      setActiveSuggestionIndex(activeSuggestionIndex - 1);
    } else if (e.keyCode === 40) {
      if (activeSuggestionIndex - 1 === filteredSuggestions.length) {
        return;
      }
      setActiveSuggestionIndex(activeSuggestionIndex + 1);
    }
  };

  const SuggestionsListComponent = () => {
    return filteredSuggestions.length ? (
      <ul className="border border-gray-300 mt-2 shadow-md rounded-md">
        {filteredSuggestions.map((suggestion, index) => {
          let className =
            index === activeSuggestionIndex
              ? "bg-gray-200 cursor-pointer"
              : "cursor-pointer";
          return (
            <li
              className={`${className} p-2 hover:bg-gray-100`}
              key={suggestion.hotel_id}
              onClick={onClick}
            >
              {suggestion.hotel_Name}
            </li>
          );
        })}
      </ul>
    ) : (
      <div className=""></div>
    );
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10">
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded shadow-md focus:outline-none focus:border-blue-500"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={userInput}
        placeholder="Search for a hotel"
      />
      {showSuggestions && userInput && <SuggestionsListComponent />}
      <input
        type="text"
        className="w-full p-2 border border-gray-300 rounded shadow-md focus:outline-none focus:border-blue-500 mt-4"
        value={selectedHotelRating}
        readOnly
        placeholder="Selected Hotel Rating"
      />
    </div>
  );
};

export default AutoSuggestion;
