import { Copy, ShieldCheck } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import type { ProjectConfig } from '@/types/project'
import { cn } from '@/lib/cn'
import { getPixPresentation } from '@/lib/pix'
import type { CopyHandler } from '@/hooks/useCopyToast'
import styles from './facilities.styles'

type PixPanelProps = {
  project: ProjectConfig
  onCopy: CopyHandler
}

export function PixPanel({ project, onCopy }: PixPanelProps) {
  const pix = getPixPresentation(project.pix)

  return (
    <div className={styles.panel}>
      <p className={styles.intro}>
        Uma demonstração de como o pagamento pode aparecer. Nenhuma cobrança é criada por esta
        experiência.
      </p>
      <div className={cn(styles.qrCard, styles.pixCard)}>
        <div className={styles.demoLabel}>PIX • DEMONSTRAÇÃO</div>
        <h4>Aponte a câmera e pague.</h4>
        <div className={styles.pixLayout}>
          <div className={styles.qrWrap}>
            <QRCodeSVG
              value={pix.qrValue}
              size={132}
              level="M"
              marginSize={2}
              role="img"
              aria-label={`QR Code Pix demonstrativo de ${project.name}`}
            />
          </div>
          <div className={styles.pixCopy}>
            <strong>{pix.receiver}</strong>
            <span>Escaneie o QR ou use a chave abaixo no app do banco.</span>
            <div className={styles.demoBadge}>
              <ShieldCheck size={11} aria-hidden="true" />
              QR fictício • sem cobrança real
            </div>
          </div>
        </div>
        <div className={styles.dataRow}>
          <label>Chave Pix fictícia</label>
          <div>
            <span>{pix.key}</span>
            <button
              type="button"
              aria-label="Copiar chave Pix fictícia"
              onClick={() => onCopy(pix.key)}
            >
              <Copy size={12} aria-hidden="true" />
              Copiar
            </button>
          </div>
        </div>
      </div>
      <div className={cn(styles.tip, styles.warning)}>
        Os dados são demonstrativos e não representam um recebedor ou pagamento real.
      </div>
    </div>
  )
}
