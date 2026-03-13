import { useState, useEffect } from "react";
import Select from "react-select";
import { Country, State, City } from "country-state-city";


export const CountryStateCityPicker = ({ value, onChange, render, countryValue, stateValue }) => {
    const [countryOptions, setCountryOptions] = useState([]);
    const [stateOptions, setStateOptions] = useState([]);
    const [cityOptions, setCityOptions] = useState([]);

useEffect(() => {
  const countries = Country.getAllCountries();
//   console.log("Countries:", countries);  // Check if you get a list of countries here

  setCountryOptions(
    countries.map((c) => ({
      label: c.name,
      value: c.name, // Keep name as value for options
    }))
  );
}, []);

useEffect(() => {
  if (countryValue) {
    const states = State.getStatesOfCountry(countryValue);
    // console.log("Picker: countryValue received for state lookup:", countryValue);

    // Find the country object by name to get its ISO code
    const countryObj = Country.getAllCountries().find(
      c => c.name.trim().toLowerCase() === String(countryValue).trim().toLowerCase()
    );
    if (countryObj) {
      const states = State.getStatesOfCountry(countryObj.isoCode); // Use ISO code here
      // console.log("States for country (Name lookup):", countryValue, states); // Log with Name context
    setStateOptions(
      states.map((s) => ({
        label: s.name,
        value: s.name,
      }))
    );
  } else {
    setStateOptions([]);
  }
  } else {
    setStateOptions([]); // Clear states if countryValue is empty
  }
}, [countryValue]); // Dependency on countryValue (the name)

useEffect(() => {
  if (countryValue && stateValue) {
    // Find the country object by name to get its ISO code
    const countryObj = Country.getAllCountries().find(
      c => c.name.trim().toLowerCase() === String(countryValue).trim().toLowerCase()
    );
    if (countryObj) {
      // Find the state object by name within the selected country's states to get its ISO code
      const stateObj = State.getStatesOfCountry(countryObj.isoCode).find(
        s => s.name.trim().toLowerCase() === String(stateValue).trim().toLowerCase()
      );
      // Ensure countryObj and stateObj are found before proceeding
      if (stateObj) { // countryObj is already checked
        const cities = City.getCitiesOfState(countryObj.isoCode, stateObj.isoCode); // Use ISO codes here
        // console.log("Cities for state (Name lookup):", stateValue, cities); // Log with Name context

    setCityOptions(
      cities.map((c) => ({
        label: c.name,
        value: c.name,
      }))
    );
  } else {
    setCityOptions([]);
  }
    } else {
      setCityOptions([]); // Clear cities if country or state name lookup fails
    }
  } else {
    setCityOptions([]); // Clear cities if countryValue or stateValue is empty
  }
}, [stateValue, countryValue]); // Dependencies on stateValue and countryValue (the names)

    const handleSelectChange = (selectedOption, { name }) => {
        if (name === "country") {
            onChange({ country: selectedOption?.value || "", state: "", city: "" });
        } else if (name === "state") {
            onChange({ state: selectedOption?.value || "", city: "" });
        } else if (name === "city") {
            onChange({ city: selectedOption?.value || "" });
        }
        // Note: onChange passes back the name (selectedOption?.value)
    };

    let selectedOption = null;
    if (render === "country") {
        if (value && countryOptions.length > 0) {
            selectedOption = countryOptions.find(c => String(c.value).trim().toLowerCase() === String(value).trim().toLowerCase()) || null;
        }
    } else if (render === "state") {
        if (value && stateOptions.length > 0) {
            selectedOption = stateOptions.find(s => String(s.value).trim().toLowerCase() === String(value).trim().toLowerCase()) || null;
        }
    } else if (render === "city") {
        if (value && cityOptions.length > 0) {
            selectedOption = cityOptions.find(c => String(c.value).trim().toLowerCase() === String(value).trim().toLowerCase()) || null;
        }
    }

    return (
        <div className="w-full">
            {(render === "country" || render === "state" || render === "city") && (
                <Select
                    name={render}
                    options={
                        render === "country"
                            ? countryOptions
                            : render === "state"
                            ? stateOptions
                            : cityOptions
                    }
                    value={selectedOption}
                    onChange={handleSelectChange}
                    isDisabled={render === "state" ? !stateOptions.length : render === "city" ? !cityOptions.length : false}
                    placeholder={` ${render.charAt(0).toUpperCase() + render.slice(1)}`}
                    classNamePrefix="react-select"
                    menuPortalTarget={typeof window !== "undefined" ? document.body : null}
                    menuPosition="fixed"
                    styles={{
                        container: (base) => ({ ...base, width: "100%" }),
                        control: (base) => ({ ...base, width: "100%" }),
                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    }}
                />
            )}
        </div>
    );
};
