import { Copy, Wifi } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import type { ProjectConfig } from '@/types/project'
import { createWifiPayload } from '@/lib/wifi'
import type { CopyHandler } from '@/hooks/useCopyToast'
import styles from './facilities.module.css'

type WifiPanelProps = {
  project: ProjectConfig
  onCopy: CopyHandler
}

export function WifiPanel({ project, onCopy }: WifiPanelProps) {
  const payload = createWifiPayload(project.wifi)

  return (
    <div className={styles.panel}>
      <p className={styles.intro}>
        Aponte a câmera para o QR Code ou copie os dados. O código já contém o nome e a senha da
        rede.
      </p>
      <div className={styles.qrCard}>
        <div className={styles.qrWrap}>
          <QRCodeSVG
            value={payload}
            size={156}
            level="M"
            marginSize={2}
            role="img"
            aria-label={`QR Code da rede Wi-Fi ${project.wifi.ssid}`}
          />
        </div>
        <div className={styles.dataRows}>
          <div className={styles.dataRow}>
            <label>Nome do Wi-Fi</label>
            <div>
              <span>{project.wifi.ssid}</span>
              <button
                type="button"
                aria-label="Copiar nome da rede Wi-Fi"
                onClick={() => onCopy(project.wifi.ssid)}
              >
                <Copy size={12} aria-hidden="true" />
                Copiar
              </button>
            </div>
          </div>
          <div className={styles.dataRow}>
            <label>Senha</label>
            <div>
              <span>{project.wifi.password}</span>
              <button
                type="button"
                aria-label="Copiar senha do Wi-Fi"
                onClick={() => onCopy(project.wifi.password)}
              >
                <Copy size={12} aria-hidden="true" />
                Copiar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.tip}>
        <Wifi size={13} aria-hidden="true" />
        Em celulares compatíveis, basta escanear para receber os dados sem digitar.
      </div>
    </div>
  )
}
