import {
  Table,
  Box,
  SpaceBetween,
  Header,
  Link,
  ExpandableSection,
  Container,
  Spinner,
} from "@cloudscape-design/components";
import queryString from "query-string";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axiosBase from "../../../../../../api/axios";

export default () => {
  //  State
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  //  Url
  const location = useLocation();
  const { id } = queryString.parse(location.search);

  //  Data
  useEffect(() => {
    const getData = async () => {
      const res = await axiosBase.get(
        "admin/estudios/proyectosGrupo/descripcion/" + id
      );
      const data = await res.data;
      setItems(data.data);
      setLoading(!loading);
    };
    getData();
  }, []);

  return (
    <Container>
      <ExpandableSection headerText="Resumen ejecutivo">
        {loading ? (
          <Spinner />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: items.resumen_ejecutivo }} />
        )}
      </ExpandableSection>
      <ExpandableSection headerText="Antecedentes">
        {loading ? (
          <Spinner />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: items.antecedentes }} />
        )}
      </ExpandableSection>
      <ExpandableSection headerText="Objetivos">
        {loading ? (
          <Spinner />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: items.objetivos }} />
        )}
      </ExpandableSection>
      <ExpandableSection headerText="Justificacion">
        {loading ? (
          <Spinner />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: items.justificacion }} />
        )}
      </ExpandableSection>
      <ExpandableSection headerText="Hipótesis">
        {loading ? (
          <Spinner />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: items.hipotesis }} />
        )}
      </ExpandableSection>
      <ExpandableSection headerText="Metodología de trabajo">
        {loading ? (
          <Spinner />
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: items.metodologia_trabajo }}
          />
        )}
      </ExpandableSection>
      <ExpandableSection headerText="Referencias bibliográficas">
        {loading ? (
          <Spinner />
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: items.referencias_bibliograficas,
            }}
          />
        )}
      </ExpandableSection>
      <ExpandableSection headerText="Contribución">
        {loading ? (
          <Spinner />
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: items.contribucion_impacto }}
          />
        )}
      </ExpandableSection>
    </Container>
  );
};
