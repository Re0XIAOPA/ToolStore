import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import Link from '@docusaurus/Link';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  emoji: string;
  link: string;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '系统教程',
    emoji: '📚',
    link: '/docs/category/system-tutorial',
    description: (
      <>
        全面覆盖 Windows、macOS、Linux、iOS、Android 等主要操作系统使用技巧。
      </>
    ),
  },
  {
    title: '软件教程',
    emoji: '🛠️',
    link: '/docs/category/software-tutorial',
    description: (
      <>
        提供开发工具、效率软件、多媒体处理等热门软件的安装配置与使用指南。
      </>
    ),
  },
  {
    title: '热门推荐',
    emoji: '🔥',
    link: '/docs/category/hot-recommend',
    description: (
      <>
        精选开源项目与实用工具资源，第一时间推送优质内容，保持前沿视野。
      </>
    ),
  },
];

function Feature({title, emoji, link, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <Link to={link} className={styles.featureLink}>
        <div className={styles.featureCard}>
          <div className={styles.featureHeader}>
            <span className={styles.featureEmoji}>{emoji}</span>
            <Heading as="h3" className={styles.featureTitle}>{title}</Heading>
          </div>
          <p className={styles.featureDescription}>{description}</p>
        </div>
      </Link>
    </div>
  );
}

export default function HomepageFeatures(): ReactNode {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
