import type {ReactNode} from 'react';
import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  Svg: React.ComponentType<React.ComponentProps<'svg'>>;
  description: ReactNode;
};

const FeatureList: FeatureItem[] = [
  {
    title: '系统教程',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <>
        全面覆盖 Windows、macOS、Linux、iOS、Android 等主流操作系统，
        从入门到进阶，助你精通各平台的使用技巧与优化方案。
      </>
    ),
  },
  {
    title: '软件教程',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <>
        涵盖开发工具、设计软件、办公应用、多媒体处理等热门软件，
        提供详细的安装配置指南和实用技巧，让你快速上手各类工具。
      </>
    ),
  },
  {
    title: '热门推荐',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
    description: (
      <>
        精选当下最火的开源项目、实用工具和技术资源，
        第一时间为你推送优质内容，保持技术前沿视野。
      </>
    ),
  },
];

function Feature({title, Svg, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
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
