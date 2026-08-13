import React, {useState} from 'react';
import clsx from 'clsx';
import {Highlight, themes} from 'prism-react-renderer';
import styles from './styles.module.css';

export interface InstallBoxProps {
  command: string;
  language?: 'bash' | 'python';
  showCopyButton?: boolean;
  className?: string;
}

const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Copy failed', err);
    return false;
  }
};

export default function InstallBox({
  command,
  language = 'bash',
  showCopyButton = true,
  className,
}: InstallBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyToClipboard(command);
    setCopied(ok);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className={clsx(styles.box, className)}>
      <div className={styles.header}>
        <span className={styles.language}>{language}</span>
        {showCopyButton ? (
          <button
            type="button"
            aria-label="Copy command"
            className={styles.copyButton}
            onClick={handleCopy}>
            <span aria-live="polite">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        ) : null}
      </div>
      <Highlight theme={themes.github} code={command} language={language}>
        {({className: prismClassName, style, tokens, getLineProps, getTokenProps}) => (
          <pre className={clsx(styles.code, prismClassName)} style={style}>
            <code>
              {tokens.map((line, lineIndex) => (
                <span key={lineIndex} {...getLineProps({line})} className={styles.codeLine}>
                  {line.map((token, tokenIndex) => (
                    <span key={tokenIndex} {...getTokenProps({token})} />
                  ))}
                </span>
              ))}
            </code>
          </pre>
        )}
      </Highlight>
    </div>
  );
}
