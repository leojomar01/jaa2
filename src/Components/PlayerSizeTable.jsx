import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

import { toast } from "react-toastify";

export default function PlayerSizeTable({
  taskId,
  CustomerName,
}) {
  // =========================
  // API URL
  // =========================
  const API_URL =
    process.env.REACT_APP_API_URL;

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
  // STATES
  // =========================
  const [rows, setRows] =
    useState([createRow()]);

  const [loading, setLoading] =
    useState(false);

  const [loadingData, setLoadingData] =
    useState(false);

  const [sortBy, setSortBy] =
    useState("none");

  const [sizeFilter, setSizeFilter] =
    useState("ALL");

  const [activeRow, setActiveRow] =
    useState(null);

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
  // FINAL CHECK
  // =========================
  const calculateFinalCheck =
    (row) => {
      return (
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
          row.tshirtCheck)
      );
    };

  // =========================
  // REMOVE EMPTY ROWS
  // =========================
  const getFilteredRows =
    (targetRows) => {
      return targetRows.filter(
        (row) => {
          return !(
            row.surname.trim() ===
              "" &&
            row.number.trim() ===
              ""
          );
        }
      );
    };

  // =========================
  // AUTO SAVE
  // =========================
  const autoSavePlayers =
    useCallback(
      async (
        updatedRows
      ) => {
        try {
          const filteredRows =
            getFilteredRows(
              updatedRows
            );

          await fetch(
            `${API_URL}/api/tasks/${taskId}/players`,
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
        } catch (error) {
          console.log(
            "AUTO SAVE ERROR:",
            error
          );
        }
      },
      [API_URL, taskId]
    );

  // =========================
  // LOAD DATA
  // =========================
  const loadPlayerData =
    useCallback(
      async () => {
        try {
          setLoadingData(
            true
          );

          const response =
            await fetch(
              `${API_URL}/api/tasks/${taskId}`
            );

          if (
            !response.ok
          ) {
            toast.error(
              "FAILED TO LOAD DATA"
            );

            return;
          }

          const data =
            await response.json();

          if (
            data.players &&
            data.players.length >
              0
          ) {
            const loadedRows =
              data.players.map(
                (
                  player
                ) => ({
                  ...createRow(),
                  ...player,
                  finalCheck:
                    calculateFinalCheck(
                      player
                    ),
                })
              );

            setRows([
              ...loadedRows,
              createRow(),
            ]);

            toast.success(
              "PLAYER DATA LOADED"
            );
          } else {
            setRows([
              createRow(),
            ]);
          }
        } catch (error) {
          console.log(
            error
          );

          toast.error(
            "ERROR LOADING DATA"
          );
        } finally {
          setLoadingData(
            false
          );
        }
      },
      [API_URL, taskId]
    );

  // =========================
  // INITIAL LOAD
  // =========================
  useEffect(() => {
    if (taskId) {
      loadPlayerData();
    }
  }, [
    taskId,
    loadPlayerData,
  ]);

  // =========================
  // COPY
  // =========================
  const copyToClipboard =
    async (text) => {
      try {
        await navigator.clipboard.writeText(
          text
        );

        toast.success(
          "COPIED!"
        );
      } catch {
        toast.error(
          "COPY FAILED"
        );
      }
    };

  // =========================
  // RESET CHECKBOXES
  // =========================
  const resetChecks = (
    row,
    field
  ) => {
    if (
      field === "jersey"
    ) {
      row.jerseyPrint = false;
      row.jerseyCheck = false;
    }

    if (
      field === "shorts"
    ) {
      row.shortsPrint = false;
      row.shortsCheck = false;
    }

    if (
      field === "warmer"
    ) {
      row.warmerPrint = false;
      row.warmerCheck = false;
    }

    if (
      field === "tshirt"
    ) {
      row.tshirtPrint = false;
      row.tshirtCheck = false;
    }
  };

  // =========================
  // UPDATE FIELD
  // =========================
  const updateField = (
    index,
    field,
    value
  ) => {
    setRows(
      (prevRows) => {
        const updatedRows =
          [
            ...prevRows,
          ];

        updatedRows[index] =
          {
            ...updatedRows[
              index
            ],
            [field]:
              value,
          };

        // RESET CHECKBOXES
        if (
          value ===
            "None" &&
          [
            "jersey",
            "shorts",
            "warmer",
            "tshirt",
          ].includes(
            field
          )
        ) {
          resetChecks(
            updatedRows[
              index
            ],
            field
          );
        }

        // RECALCULATE FINAL
        updatedRows[
          index
        ].finalCheck =
          calculateFinalCheck(
            updatedRows[
              index
            ]
          );

        // AUTO ADD ROW
        const isLastRow =
          index ===
          updatedRows.length - 1;

        const row =
          updatedRows[index];

        const hasData =
          row.surname.trim() !==
            "" ||
          row.number.trim() !==
            "" ||
          row.jersey !==
            "None" ||
          row.shorts !==
            "None" ||
          row.warmer !==
            "None" ||
          row.tshirt !==
            "None";

        if (
          isLastRow &&
          hasData
        ) {
          updatedRows.push(
            createRow()
          );
        }

        // AUTO SAVE CHECKBOX
        if (
          field.includes(
            "Check"
          ) ||
          field.includes(
            "Print"
          )
        ) {
          autoSavePlayers(
            updatedRows
          );
        }

        return updatedRows;
      }
    );
  };

  // =========================
  // CLEAR BLANK
  // =========================
  const clearBlankRows =
    () => {
      const filteredRows =
        getFilteredRows(
          rows
        );

      setRows([
        ...filteredRows,
        createRow(),
      ]);

      toast.success(
        "BLANK ROWS CLEARED"
      );
    };

  // =========================
  // SAVE
  // =========================
  const saveToDatabase =
    async () => {
      try {
        setLoading(true);

        const filteredRows =
          getFilteredRows(
            rows
          );

        const response =
          await fetch(
            `${API_URL}/api/tasks/${taskId}/players`,
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

        const data =
          await response.json();

        if (
          !response.ok
        ) {
          toast.error(
            data.message ||
              "FAILED TO SAVE"
          );

          return;
        }

        toast.success(
          "PLAYER SIZES SAVED!"
        );
      } catch (error) {
        console.log(
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

  // =========================
  // SORT + FILTER
  // =========================
  const processedRows =
    useMemo(() => {
      return [...rows]
        .filter(
          (
            row,
            index
          ) => {
            const isLastRow =
              index ===
              rows.length - 1;

            if (
              isLastRow
            )
              return true;

            if (
              sizeFilter !==
              "ALL"
            ) {
              const hasSize =
                row.jersey ===
                  sizeFilter ||
                row.shorts ===
                  sizeFilter ||
                row.warmer ===
                  sizeFilter ||
                row.tshirt ===
                  sizeFilter;

              if (
                !hasSize
              )
                return false;
            }

            return true;
          }
        )
        .sort(
          (
            a,
            b
          ) => {
            const aEmpty =
              a.surname ===
                "" &&
              a.number ===
                "";

            const bEmpty =
              b.surname ===
                "" &&
              b.number ===
                "";

            if (
              aEmpty
            )
              return 1;

            if (
              bEmpty
            )
              return -1;

            if (
              sortBy ===
              "name"
            ) {
              return a.surname.localeCompare(
                b.surname
              );
            }

            if (
              sortBy ===
              "number"
            ) {
              return (
                Number(
                  a.number
                ) -
                Number(
                  b.number
                )
              );
            }

            return 0;
          }
        );
    }, [
      rows,
      sortBy,
      sizeFilter,
    ]);

  return (
    <div className="min-h-screen bg-[#020b2d] p-4 text-white">
      <div className="max-w-7xl mx-auto bg-[#1b2945] rounded-3xl overflow-hidden shadow-2xl border border-cyan-500/20">
        {/* HEADER */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-3xl font-extrabold">
              {CustomerName ||
                "Customer"}{" "}
              Size Information
            </h1>

            <div className="flex gap-3">
              <button
                onClick={
                  loadPlayerData
                }
                disabled={
                  loadingData ||
                  loading
                }
                className="
                  px-6 py-3
                  rounded-xl
                  bg-white
                  hover:bg-slate-200
                  disabled:opacity-50
                  disabled:cursor-not-allowed
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
                  loading ||
                  loadingData
                }
                className="
                  px-6 py-3
                  rounded-xl
                  bg-cyan-300
                  hover:bg-cyan-200
                  disabled:opacity-50
                  disabled:cursor-not-allowed
                  text-black
                  font-black
                "
              >
                {loading
                  ? "SAVING..."
                  : loadingData
                  ? "LOADING..."
                  : "SAVE"}
              </button>
            </div>
          </div>
        </div>

        <div className="p-3">
          {/* ACTIONS */}
          <div className="flex flex-wrap gap-3 mb-4">
            <button
              onClick={() =>
                setRows([
                  ...rows,
                  createRow(),
                ])
              }
              className="
                px-4 py-2
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
                px-4 py-2
                rounded-xl
                bg-red-400
                hover:bg-red-300
                text-black
                font-bold
              "
            >
              CLEAR BLANK
            </button>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
              className="
                px-4 py-2
                rounded-xl
                bg-cyan-400
                text-black
                font-bold
              "
            >
              <option value="none">
                SORT
              </option>

              <option value="name">
                SORT NAME
              </option>

              <option value="number">
                SORT NUMBER
              </option>
            </select>

            <select
              value={
                sizeFilter
              }
              onChange={(e) =>
                setSizeFilter(
                  e.target.value
                )
              }
              className="
                px-4 py-2
                rounded-xl
                bg-pink-400
                text-black
                font-bold
              "
            >
              <option value="ALL">
                ALL SIZES
              </option>

              {sizeOptions.map(
                (size) => (
                  <option
                    key={size}
                    value={size}
                  >
                    {size}
                  </option>
                )
              )}
            </select>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto rounded-2xl border border-cyan-500/20">
            <table className="w-full min-w-[1150px] border-collapse text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                  <th className="p-2 border">
                    No.
                  </th>

                  <th className="p-2 border">
                    Surname
                  </th>

                  <th className="p-2 border">
                    Number
                  </th>

                  <th className="p-2 border">
                    Jersey
                  </th>

                  <th className="p-2 border">
                    Shorts
                  </th>

                  <th className="p-2 border">
                    Warmer
                  </th>

                  <th className="p-2 border">
                    T-Shirt
                  </th>

                  <th className="p-2 border">
                    Final
                  </th>
                </tr>
              </thead>

              <tbody>
                {processedRows.map(
                  (
                    row,
                    index
                  ) => (
                    <tr
                      key={index}
                      className={`
                        ${
                          activeRow ===
                          index
                            ? "bg-green-500/50"
                            : index %
                                2 ===
                              0
                            ? "bg-[#1b2945]"
                            : "bg-[#223250]"
                        }

                        hover:bg-green-500/70
                        transition-all
                        duration-200
                      `}
                    >
                      {/* NO */}
                      <td className="p-2 border text-center">
                        {index + 1}
                      </td>

                      {/* SURNAME */}
                      <td className="p-2 border">
                        <div className="flex gap-2">
                          <input
                            value={
                              row.surname
                            }
                            onFocus={() =>
                              setActiveRow(
                                index
                              )
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
                              w-full
                              p-2
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
                              px-3
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
                      <td className="p-2 border">
                        <div className="flex gap-2">
                          <input
                            value={
                              row.number
                            }
                            onFocus={() =>
                              setActiveRow(
                                index
                              )
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
                              w-full
                              p-2
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
                              px-3
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
                            className="p-2 border"
                          >
                            <div className="flex flex-col gap-2 items-center">
                              <select
                                value={
                                  row[
                                    field
                                  ]
                                }
                                onFocus={() =>
                                  setActiveRow(
                                    index
                                  )
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
                                  p-1
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
                                {/* PRINT */}
                                <label className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    disabled={
                                      row[
                                        field
                                      ] ===
                                      "None"
                                    }
                                    checked={
                                      row[
                                        field
                                      ] ===
                                      "None"
                                        ? false
                                        : row[
                                            printField
                                          ]
                                    }
                                    onFocus={() =>
                                      setActiveRow(
                                        index
                                      )
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

                                {/* DONE */}
                                <label className="flex items-center gap-1">
                                  <input
                                    type="checkbox"
                                    disabled={
                                      row[
                                        field
                                      ] ===
                                      "None"
                                    }
                                    checked={
                                      row[
                                        field
                                      ] ===
                                      "None"
                                        ? false
                                        : row[
                                            checkField
                                          ]
                                    }
                                    onFocus={() =>
                                      setActiveRow(
                                        index
                                      )
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
                      <td className="p-2 border text-center">
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