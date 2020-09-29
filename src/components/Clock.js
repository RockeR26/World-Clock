import React, { useState } from "react";
import ct from "countries-and-timezones";
import { getCode } from "country-list";
import axios from "axios";
import Moment from "react-moment";

const Clock = () => {
  //states
  const [date, setDate] = useState(new Date());
  const [display, setDisplay] = useState(false);
  const [dark, setDark] = useState(false);
  const [world, setWorld] = useState({
    present: false,
    country: "",
    date: "",
    utc: "",
    time: "",
    error: false,
    temp: "",
  });

  //handlers
  function Click() {
    setDark(!dark);
  }
  function onChange(e) {
    const { name, value } = e.target;
    setWorld({
      ...world,
      [name]: value,
    });
  }
  setTimeout(() => {
    setDate(new Date());
  }, 1000);

  async function onSubmit(e) {
    try {
      e.preventDefault();
      // console.log(getCode(world.temp));
      if (getCode(world.temp) !== undefined) {
        //name of country
        const name = ct.getCountry(getCode(world.temp)).name;
        // console.log(ct.getCountry(getCode(world.temp)));

        //api call
        const res = await axios.get(
          "https://worldtimeapi.org/api/timezone/" +
            ct.getCountry(getCode(world.temp)).timezones[
              ct.getCountry(getCode(world.temp)).timezones.length - 1
            ]
        );
        // console.log("hello");
        // console.log(res.data);
        //time split
        const t = res.data.datetime.split("T");

        //setting Data
        setWorld({
          ...world,
          present: true,
          country: name,
          date: t[0],
          time: t[1].substring(0, 5),
          utc: res.data.utc_offset,
          temp: "",
        });
      } else {
        setWorld({ ...world, error: true });
        setTimeout(() => {
          setWorld({ ...world, error: false });
        }, 2500);
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className={dark ? "dark" : "main"}>
      <div className="adjust">
        <p onClick={Click}>
          <i className="fas fa-adjust"></i>
          {dark ? "  On" : "  Off"}
        </p>
      </div>
      <div className="container">
        <h1>
          World Time <i className="fas fa-clock"></i>
        </h1>
        <br />
        <div className="content-box">
          <div className="content">
            <br />
            <h3>
              Date: <Moment format="DD-MM-YY">{date.d}</Moment>
            </h3>
            <h1>
              <Moment format="HH:mm:ss">{date.d}</Moment>
            </h1>
            <h4>
              GMT: <Moment format="Z">{date.d}</Moment>
            </h4>
            <br />
          </div>
          {world.present && (
            <>
              <br />
              <div className="content">
                <h3 className="style">
                  <u>{world.country}'s Time</u>
                </h3>
                <br />
                <h3>Date: {world.date}</h3>
                <h1>{world.time}</h1>
                <h5>GMT: {world.utc}</h5>
                <br />
              </div>
              <br />
            </>
          )}
        </div>
        {world.present && (
          <>
            {" "}
            <button
              className={dark ? "btn-light" : "btn-dark"}
              onClick={() => {
                setWorld({ ...world, present: false });
              }}
            >
              <i className="fas fa-arrow-left"></i>
            </button>
            <br />
          </>
        )}
        {!world.present && (
          <>
            {world.error && (
              <>
                <br />
                <span className="alert">
                  Invalid Country Name Entered!! OR Enter Full Name!!
                </span>
                <br />
              </>
            )}
            {display ? (
              <form onSubmit={onSubmit}>
                <br />
                <br />
                <input
                  type="text"
                  name="temp"
                  placeholder="Enter any country"
                  onChange={onChange}
                  value={world.temp}
                />
              </form>
            ) : (
              <>
                <br />
                <button
                  className={dark ? "btn-light" : "btn-dark"}
                  onClick={() => {
                    setDisplay(!display);
                  }}
                >
                  <i className="fas fa-search"></i>
                </button>
                <br />
              </>
            )}
          </>
        )}
        <br />
        <span>&copy;Rocker2601</span>
      </div>
    </div>
  );
};

export default Clock;
