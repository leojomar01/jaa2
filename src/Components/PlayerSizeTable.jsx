import React, {
  useState,
  useEffect,
} from "react";

import { toast } from "react-toastify";

export default function PlayerSizeTable({
  taskId,
}) {

  console.log(
    "TASK ID:",
    taskId
  );

  // =========================
  // CREATE EMPTY ROW
  // =========================
  const createRow = () => ({
    surname: "",
    number: "",

    jersey: "None",
    shorts: "None",
    warmer: "None",
    tshirt: "None",

    jerseyPrint: false,
    jerseyCheck: false,

    shortsPrint: false,
    shortsCheck: false,

    warmerPrint: false,
    warmerCheck: false,

    tshirtPrint: false,
    tshirtCheck: false,

    finalCheck: false,
  });

  // =========================
  // SIZE OPTIONS
  // =========================
  const sizeOptions = [
    "None",
    "1-2",
    "3-4",
    "5-6",
    "7-8",
    "XS",
    "S",
    "M",
    "L",
    "XL",
    "2XL",
    "3XL",
    "4XL",
    "5XL",
  ];

  // =========================
  // STATE
  // =========================
  const [rows, setRows] =
    useState([createRow()]);

  const [loading, setLoading] =
    useState(false);

  const [loadingData, setLoadingData] =
    useState(false);

  // =========================
  // LOAD PLAYER DATA
  // =========================
  useEffect(() => {
    if (taskId) {
      ;
    }
  }, [taskId]);

  // =========================
  // FETCH EXISTING DATA
  // =========================
  const loadPlayerData =
    async () => {

      try {

        setLoadingData(true);

        console.log(
          "LOADING PLAYER DATA..."
        );

        const response =
          await fetch(
            `http://localhost:5000/api/tasks/${taskId}`
          );

        console.log(
          "GET STATUS:",
          response.status
        );

        if (!response.ok) {

          toast.error(
            "FAILED TO LOAD DATA"
          );

          return;
        }

        const data =
          await response.json();

        console.log(
          "TASK DATA:",
          data
        );

        // =========================
        // LOAD PLAYERS
        // =========================
        if (
          data.players &&
          data.players.length > 0
        ) {

          setRows([
            ...data.players,
            createRow(),
          ]);

          toast.success(
            "PLAYER DATA LOADED"
          );

        }

      } catch (error) {

        console.log(
          "LOAD ERROR:",
          error
        );

        toast.error(
          "ERROR LOADING DATA"
        );

      } finally {

        setLoadingData(false);

      }
    };

  // =========================
  // SIZE COLOR
  // =========================
  const getSizeColor = (
    size
  ) => {

    const colors = {
      None: "#e5e7eb",

      "1-2": "#fde68a",
      "3-4": "#fcd34d",
      "5-6": "#86efac",
      "7-8": "#67e8f9",

      XS: "#d8b4fe",
      S: "#c4b5fd",
      M: "#93c5fd",
      L: "#6ee7b7",
      XL: "#f9a8d4",

      "2XL": "#fca5a5",
      "3XL": "#fdba74",
      "4XL": "#a5b4fc",
      "5XL": "#f0abfc",
    };

    return (
      colors[size] ||
      "#e5e7eb"
    );
  };

  // =========================
  // COPY
  // =========================
  const copyToClipboard = (
    text
  ) => {

    navigator.clipboard.writeText(
      text
    );

    toast.success("COPIED!");
  };

  // =========================
  // UPDATE FIELD
  // =========================
  const updateField = (
    index,
    field,
    value
  ) => {

    const updated = [...rows];

    updated[index][field] =
      value;

    const row =
      updated[index];

    // =========================
    // FINAL CHECK
    // =========================
    row.finalCheck =
      (row.jersey ===
        "None" ||
        row.jerseyCheck) &&
      (row.shorts ===
        "None" ||
        row.shortsCheck) &&
      (row.warmer ===
        "None" ||
        row.warmerCheck) &&
      (row.tshirt ===
        "None" ||
        row.tshirtCheck);

    // =========================
    // AUTO ADD ROW
    // =========================
    const isLastRow =
      index ===
      updated.length - 1;

    const hasData =
      row.surname.trim() !==
        "" ||
      row.number.trim() !==
        "" ||
      row.jersey !== "None" ||
      row.shorts !== "None" ||
      row.warmer !== "None" ||
      row.tshirt !== "None";

    if (
      isLastRow &&
      hasData
    ) {

      updated.push(
        createRow()
      );
    }

    setRows(updated);
  };

  // =========================
  // CLEAR BLANK ROWS
  // =========================
  const clearBlankRows =
    () => {

      const filtered =
        rows.filter((row) => {

          return !(
            row.surname.trim() ===
              "" &&
            row.number.trim() ===
              ""
          );
        });

      setRows(
        filtered.length > 0
          ? [
              ...filtered,
              createRow(),
            ]
          : [createRow()]
      );

      toast.success(
        "BLANK ROWS CLEARED"
      );
    };

  // =========================
  // SAVE TO DATABASE
  // =========================
  const saveToDatabase =
    async () => {

      try {

        setLoading(true);

        // =========================
        // REMOVE EMPTY ROW
        // =========================
        const filteredRows =
          rows.filter((row) => {

            return !(
              row.surname.trim() ===
                "" &&
              row.number.trim() ===
                ""
            );
          });

        console.log(
          "SAVING PLAYERS:",
          filteredRows
        );

        // =========================
        // API REQUEST
        // =========================
        const response =
          await fetch(
            `http://localhost:5000/api/tasks/${taskId}/players`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                players:
                  filteredRows,
              }),
            }
          );

        console.log(
          "SAVE STATUS:",
          response.status
        );

        const data =
          await response.json();

        console.log(
          "SAVE RESPONSE:",
          data
        );

        // =========================
        // FAILED
        // =========================
        if (!response.ok) {

          toast.error(
            data.message ||
              "FAILED TO SAVE"
          );

          return;
        }

        // =========================
        // SUCCESS
        // =========================
        toast.success(
          "PLAYER SIZES SAVED!"
        );

      } catch (error) {

        console.log(
          "SAVE ERROR:",
          error
        );

        toast.error(
          "ERROR SAVING DATA"
        );

      } finally {

        setLoading(false);

      }
    };

  // =========================
  // SIZE FIELDS
  // =========================
  const sizeFields = [
    [
      "jersey",
      "jerseyCheck",
      "jerseyPrint",
    ],

    [
      "shorts",
      "shortsCheck",
      "shortsPrint",
    ],

    [
      "warmer",
      "warmerCheck",
      "warmerPrint",
    ],

    [
      "tshirt",
      "tshirtCheck",
      "tshirtPrint",
    ],
  ];

  return (
    <div className="min-h-screen bg-[#020b2d] p-4 text-white">

      <div className="max-w-7xl mx-auto bg-[#1b2945] rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/20">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-5">

          <div className="flex items-center justify-between">

            <h1 className="text-3xl font-extrabold">
              Player Size Information
            </h1>

            <div className="flex gap-3">

              <button
                onClick={
                  loadPlayerData
                }
                disabled={
                  loadingData
                }
                className="
                  px-6 py-3
                  rounded-xl
                  bg-white
                  hover:bg-slate-200
                  text-black
                  font-black
                "
              >
                {loadingData
                  ? "LOADING..."
                  : "REFRESH"}
              </button>

              <button
                onClick={
                  saveToDatabase
                }
                disabled={
                  loading
                }
                className="
                  px-6 py-3
                  rounded-xl
                  bg-cyan-300
                  hover:bg-cyan-200
                  disabled:opacity-50
                  text-black
                  font-black
                  shadow-lg
                "
              >

                {loading
                  ? "SAVING..."
                  : "SAVE"}

              </button>

            </div>

          </div>

        </div>

        <div className="p-6">

          {/* ACTIONS */}
          <div className="flex gap-3 mb-6">

            <button
              onClick={() =>
                setRows([
                  ...rows,
                  createRow(),
                ])
              }
              className="
                px-6 py-3
                rounded-xl
                bg-green-400
                hover:bg-green-300
                text-black
                font-bold
              "
            >
              + ADD ROW
            </button>

            <button
              onClick={
                clearBlankRows
              }
              className="
                px-6 py-3
                rounded-xl
                bg-red-400
                hover:bg-red-300
                text-black
                font-bold
              "
            >
              CLEAR BLANK
            </button>

          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-cyan-500/20">

            <table className="w-full min-w-[1150px] border-collapse text-sm">

              <thead>

                <tr className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">

                  <th className="p-3 border">
                    No.
                  </th>

                  <th className="p-3 border">
                    Surname
                  </th>

                  <th className="p-3 border">
                    Number
                  </th>

                  <th className="p-3 border">
                    Jersey
                  </th>

                  <th className="p-3 border">
                    Shorts
                  </th>

                  <th className="p-3 border">
                    Warmer
                  </th>

                  <th className="p-3 border">
                    T-Shirt
                  </th>

                  <th className="p-3 border">
                    Final
                  </th>

                </tr>

              </thead>

              <tbody>

                {rows.map(
                  (
                    row,
                    index
                  ) => (

                    <tr
                      key={index}
                      className="
                        odd:bg-[#1b2945]
                        even:bg-[#223250]
                      "
                    >

                      {/* NUMBER */}
                      <td className="p-3 border text-center">
                        {index + 1}
                      </td>

                      {/* SURNAME */}
                      <td className="p-3 border">

                        <div className="flex gap-2">

                          <input
                            value={
                              row.surname
                            }
                            onChange={(
                              e
                            ) =>
                              updateField(
                                index,
                                "surname",
                                e.target.value.toUpperCase()
                              )
                            }
                            className="
                              w-full p-2
                              rounded-xl
                              bg-[#08122f]
                              border
                              border-cyan-500/20
                            "
                          />

                          <button
                            onClick={() =>
                              copyToClipboard(
                                row.surname
                              )
                            }
                            className="
                              px-3 py-1
                              rounded-lg
                              bg-cyan-400
                              text-black
                              font-bold
                            "
                          >
                            COPY
                          </button>

                        </div>

                      </td>

                      {/* NUMBER */}
                      <td className="p-3 border">

                        <div className="flex gap-2">

                          <input
                            value={
                              row.number
                            }
                            onChange={(
                              e
                            ) =>
                              updateField(
                                index,
                                "number",
                                e.target.value
                              )
                            }
                            className="
                              w-full p-2
                              rounded-xl
                              bg-[#08122f]
                              border
                              border-cyan-500/20
                            "
                          />

                          <button
                            onClick={() =>
                              copyToClipboard(
                                row.number
                              )
                            }
                            className="
                              px-3 py-1
                              rounded-lg
                              bg-cyan-400
                              text-black
                              font-bold
                            "
                          >
                            COPY
                          </button>

                        </div>

                      </td>

                      {/* SIZE FIELDS */}
                      {sizeFields.map(
                        ([
                          field,
                          checkField,
                          printField,
                        ]) => (

                          <td
                            key={field}
                            className="p-3 border"
                          >

                            <div className="flex flex-col gap-2 items-center">

                              <select
                                value={
                                  row[
                                    field
                                  ]
                                }
                                onChange={(
                                  e
                                ) =>
                                  updateField(
                                    index,
                                    field,
                                    e.target.value
                                  )
                                }
                                style={{
                                  backgroundColor:
                                    getSizeColor(
                                      row[
                                        field
                                      ]
                                    ),
                                  color:
                                    "#000",
                                }}
                                className="
                                  w-[100px]
                                  p-2
                                  rounded-lg
                                  font-bold
                                "
                              >

                                {sizeOptions.map(
                                  (
                                    size
                                  ) => (
                                    <option
                                      key={
                                        size
                                      }
                                      value={
                                        size
                                      }
                                    >
                                      {
                                        size
                                      }
                                    </option>
                                  )
                                )}

                              </select>

                              <div className="flex gap-2 text-xs">

                                <label className="flex items-center gap-1">

                                  <input
                                    type="checkbox"
                                    checked={
                                      row[
                                        printField
                                      ]
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      updateField(
                                        index,
                                        printField,
                                        e.target.checked
                                      )
                                    }
                                  />

                                  PRINT

                                </label>

                                <label className="flex items-center gap-1">

                                  <input
                                    type="checkbox"
                                    checked={
                                      row[
                                        checkField
                                      ]
                                    }
                                    onChange={(
                                      e
                                    ) =>
                                      updateField(
                                        index,
                                        checkField,
                                        e.target.checked
                                      )
                                    }
                                  />

                                  DONE

                                </label>

                              </div>

                            </div>

                          </td>
                        )
                      )}

                      {/* FINAL */}
                      <td className="p-3 border text-center">

                        <span
                          className={`px-4 py-2 rounded-xl font-bold ${
                            row.finalCheck
                              ? "bg-cyan-400 text-black"
                              : "bg-pink-500 text-white"
                          }`}
                        >
                          {row.finalCheck
                            ? "COMPLETE"
                            : "PENDING"}
                        </span>

                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}