import { ReactNode, useState } from "react";
import Head from "next/head";
import type { NextPage } from "next";
import { useInterval } from "usehooks-ts";

interface GptObject {
  [key: string]: {
    role: string;
    content: string;
  };
}

const callGpt = async (msg: string) => {
  const data = {
    message: msg,
  };

  fetch("http://localhost:44444/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then(response => {
      // handle the response
      console.log(response);
    })
    .catch(error => {
      // handle the error
      console.log(error);
    });
};

const Home: NextPage = () => {
  const [inputValue, setInputValue] = useState("");

  const initial: GptObject = {
    // your gpt object here
  };
  const [gpt, setGpt] = useState(initial);

  const readGpt = async () => {
    fetch("http://localhost:44444/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(response => {
        // handle the response
        response.text().then(text => {
          console.log("response", text);
          try {
            setGpt(JSON.parse(text).reverse());
          } catch (e) {
            console.log("err", e);
          }
        });
      })
      .catch(error => {
        // handle the error
        console.log(error);
      });
  };

  useInterval(() => {
    readGpt();
  }, 1500);

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const stateRender: ReactNode[] = [];

  Object.keys(gpt).forEach(key => {
    stateRender.push(
      <div>
        {gpt[key].role}: {gpt[key].content}
      </div>,
    );
  });

  return (
    <>
      <Head>
        <title>Scaffold-eth App</title>
        <meta name="description" content="Created with 🏗 scaffold-eth" />
      </Head>

      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type here"
          className="input w-full max-w-xs"
          autoFocus={true}
        />

        <button
          onClick={() => {
            callGpt(inputValue);
            setInputValue("");
          }}
          className="btn btn-primary mt-4"
        >
          send
        </button>
        <div className="items-center justify-center min-h-screen py-2">{stateRender}</div>
      </div>
    </>
  );
};

export default Home;
