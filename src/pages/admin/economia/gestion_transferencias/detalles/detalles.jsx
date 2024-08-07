import {
  Badge,
  Box,
  Button,
  Container,
  Grid,
  Header,
  SpaceBetween,
  Spinner,
} from "@cloudscape-design/components";
import ModalCalificarTransferencia from "./components/modalCalificarTransferencia";
import { useState } from "react";
import axiosBase from "../../../../../api/axios";

export default ({ id, proyecto, solicitud, loading, reload }) => {
  //  States
  const [visible, setVisible] = useState(false);
  const [loadingReporte, setLoadingReporte] = useState(false);

  //  Functions
  const reporte = async () => {
    setLoadingReporte(true);
    const res = await axiosBase.get("admin/economia/transferencias/reporte", {
      params: {
        geco_proyecto_id: id,
      },
      responseType: "blob",
    });
    setLoadingReporte(false);
    const blob = await res.data;
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  };

  return (
    <Grid
      gridDefinition={[
        {
          colspan: {
            default: 12,
            xl: 4,
            l: 4,
            m: 4,
            s: 4,
            xs: 4,
          },
        },
        {
          colspan: {
            default: 12,
            xl: 8,
            l: 8,
            m: 8,
            s: 8,
            xs: 8,
          },
        },
      ]}
    >
      <Container
        header={<Header variant="h2">Detalles del proyecto</Header>}
        fitHeight
      >
        <SpaceBetween size="s">
          <div>
            <Box variant="awsui-key-label">Tipo</Box>
            {loading ? <Spinner /> : <div>{proyecto.tipo_proyecto}</div>}
          </div>
          <div>
            <Box variant="awsui-key-label">Título</Box>
            {loading ? <Spinner /> : <div>{proyecto.titulo}</div>}
          </div>
          <div>
            <Box variant="awsui-key-label">Código de proyecto</Box>
            {loading ? <Spinner /> : <div>{proyecto.codigo_proyecto}</div>}
          </div>
        </SpaceBetween>
      </Container>
      <Container
        header={
          <Header
            variant="h2"
            actions={
              <SpaceBetween direction="horizontal" size="s">
                <Button onClick={reporte} loading={loadingReporte}>
                  Reporte
                </Button>
                <Button
                  variant="primary"
                  disabled={solicitud?.estado != 3}
                  onClick={() => setVisible(true)}
                >
                  Calificar
                </Button>
              </SpaceBetween>
            }
          >
            Última solicitud
          </Header>
        }
        fitHeight
      >
        <SpaceBetween size="s">
          <div>
            <Box variant="awsui-key-label">Justificación</Box>
            {loading ? <Spinner /> : <div>{solicitud.justificacion}</div>}
          </div>
          <div>
            <Box variant="awsui-key-label">Estado</Box>
            {loading ? (
              <Spinner />
            ) : (
              <Badge
                color={
                  solicitud.estado == 1
                    ? "green"
                    : solicitud.estado == 2
                    ? "red"
                    : solicitud.estado == 3
                    ? "blue"
                    : "grey"
                }
              >
                {solicitud.estado == 1
                  ? "Aprobado"
                  : solicitud.estado == 2
                  ? "Rechazado"
                  : solicitud.estado == 3
                  ? "Nueva transferencia"
                  : "Temporal"}
              </Badge>
            )}
          </div>
          <div>
            <Box variant="awsui-key-label">Fecha de solicitud</Box>
            {loading ? <Spinner /> : <div>{solicitud.created_at}</div>}
          </div>
        </SpaceBetween>
      </Container>
      {visible && (
        <ModalCalificarTransferencia
          visible={visible}
          setVisible={setVisible}
          reload={reload}
        />
      )}
    </Grid>
  );
};
