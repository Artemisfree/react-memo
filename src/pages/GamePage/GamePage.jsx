import { useParams, useLocation } from "react-router-dom";
import React from "react";

import { Cards } from "../../components/Cards/Cards";

export function GamePage() {
  const { pairsCount } = useParams();
  const query = new URLSearchParams(useLocation().search);
  const threeMistakesMode = query.get("threeMistakesMode") === "true";

  return (
    <>
      <Cards pairsCount={parseInt(pairsCount, 10)} previewSeconds={5} threeMistakesMode={threeMistakesMode}></Cards>
    </>
  );
}
