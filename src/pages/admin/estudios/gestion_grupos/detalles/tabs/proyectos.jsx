import {
  Table,
  Box,
  SpaceBetween,
  Header,
  Link,
} from "@cloudscape-design/components";
import queryString from "query-string";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosBase from "../../../../../../api/axios";

export default () => {
  //  States
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  //  Url
  const location = useLocation();
  const { id } = queryString.parse(location.search);

  //  Data
  useEffect(() => {
    const getData = async () => {
      const res = await axiosBase.get("admin/estudios/grupos/proyectos/" + id);
      const data = await res.data;
      setItems(data.data);
      setLoading(!loading);
    };
    getData();
  }, []);

  return (
    <Table
      columnDefinitions={[
        {
          id: "titulo",
          header: "Título",
          cell: (item) => <Link href="#">{item.titulo}</Link>,
        },
        {
          id: "periodo",
          header: "Periodo",
          cell: (item) => item.periodo,
        },
        {
          id: "tipo_proyecto",
          header: "Tipo de proyecto",
          cell: (item) => item.tipo_proyecto,
        },
      ]}
      columnDisplay={[
        { id: "titulo", visible: true },
        { id: "periodo", visible: true },
        { id: "tipo_proyecto", visible: true },
      ]}
      enableKeyboardNavigation
      items={items}
      loadingText="Cargando datos"
      loading={loading}
      resizableColumns
      trackBy="id"
      empty={
        <Box margin={{ vertical: "xs" }} textAlign="center" color="inherit">
          <SpaceBetween size="m">
            <b>No hay registros...</b>
          </SpaceBetween>
        </Box>
      }
      header={<Header>Proyectos</Header>}
    />
  );
};
