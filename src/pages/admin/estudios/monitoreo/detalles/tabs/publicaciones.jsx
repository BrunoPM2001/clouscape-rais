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
      const res = await axiosBase.get(
        "admin/estudios/monitoreo/publicaciones/" + id
      );
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
          id: "id",
          header: "ID",
          cell: (item) => item.id,
        },
        {
          id: "titulo",
          header: "Título",
          cell: (item) => item.titulo,
        },
        {
          id: "tipo_publicacion",
          header: "Tipo de publicación",
          cell: (item) => item.tipo_publicacion,
        },
        {
          id: "periodo",
          header: "Periodo",
          cell: (item) => item.periodo,
        },
        {
          id: "estado",
          header: "Estado",
          cell: (item) => item.estado,
        },
      ]}
      columnDisplay={[
        { id: "id", visible: true },
        { id: "titulo", visible: true },
        { id: "tipo_publicacion", visible: true },
        { id: "periodo", visible: true },
        { id: "estado", visible: true },
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
      header={<Header>Publicaciones del proyecto</Header>}
    />
  );
};
