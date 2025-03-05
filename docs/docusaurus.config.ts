import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

const config: Config = {
    title: 'A open-source nodejs library support to payment with VNPay',
    tagline: 'A Node.js library for integrating VNPay payment gateway into your applications.',
    favicon: 'https://github.githubassets.com/favicons/favicon.png',

    // Set the production url of your site here
    url: 'https://vnpay.js.org',
    // Set the /<baseUrl>/ pathname under which your site is served
    // For GitHub pages deployment, it is often '/<projectName>/'
    baseUrl: '/',

    // GitHub pages deployment config.
    // If you aren't using GitHub pages, you don't need these.
    organizationName: 'lehuygiang28', // Usually your GitHub org/user name.
    projectName: 'vnpay', // Usually your repo name.
    deploymentBranch: 'docs-page',
    trailingSlash: false,

    onBrokenLinks: 'warn',
    onBrokenMarkdownLinks: 'warn',

    // Even if you don't use internationalization, you can use this field to set
    // useful metadata like html lang. For example, if your site is Chinese, you
    // may want to replace "en" with "zh-Hans".
    i18n: {
        defaultLocale: 'vi',
        locales: ['vi', 'en'],
    },

    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    routeBasePath: '/', // Serve the docs at the site's root
                    sidebarPath: './sidebars.ts',
                    // Please change this to your repo.
                    // Remove this to remove the "edit this page" links.
                    editUrl: 'https://github.com/lehuygiang28/vnpay/tree/main/docs',
                    showLastUpdateTime: true,
                    showLastUpdateAuthor: true,
                },
                blog: false,
                theme: {
                    customCss: ['./static/css/custom.css'],
                },
                gtag: {
                    trackingID: 'G-7FJ9XVCX4G',
                    anonymizeIP: false,
                },
            } satisfies Preset.Options,
        ],
    ],

    themeConfig: {
        // Replace with your project's social card
        // image: 'img/docusaurus-social-card.jpg',
        metadata: [
            {
                name: 'description',
                content: 'An open-source nodejs library support to payment with VNPay',
            },
            { name: 'og:title', content: 'vnpayjs' },
            {
                name: 'og:description',
                content: 'An open-source nodejs library support to payment with VNPay',
            },
            { name: 'og:url', content: 'https://vnpay.js.org' },
            { name: 'og:site_name', content: 'vnpayjs' },
            { name: 'og:type', content: 'website' },
            { name: 'og:locale', content: 'vi_VN' },
            { name: 'og:locale:alternate', content: 'en_US' },
            {
                name: 'keywords',
                content:
                    'vnpay, vnpayjs, nodejs, payment, library, open-source, vnpay api, vnpay doc, vnpay sandbox, vnpay test, vnpay node, vnpay nodejs',
            },
        ],
        navbar: {
            title: 'vnpayjs',
            items: [
                {
                    type: 'localeDropdown',
                    position: 'right',
                },
                {
                    href: 'https://github.com/lehuygiang28/vnpay',
                    label: 'GitHub',
                    position: 'right',
                },
                {
                    href: 'https://www.npmjs.com/package/vnpay',
                    label: 'Npm',
                    position: 'right',
                },
            ],
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'More',
                    items: [
                        {
                            label: 'VNPay Official Docs',
                            href: 'https://sandbox.vnpayment.vn/apis/',
                        },
                        {
                            label: 'GitHub',
                            href: 'https://github.com/lehuygiang28/vnpay',
                        },
                        {
                            label: 'NPM',
                            href: 'https://npmjs.com/package/vnpay',
                        },
                    ],
                },
            ],
            copyright: 'Copyright © 2024 lehuygiang28. Built with Docusaurus.',
        },
        prism: {
            theme: prismThemes.vsLight,
            darkTheme: prismThemes.dracula,
            defaultLanguage: 'typescript',
        },
        colorMode: {
            defaultMode: 'dark',
            respectPrefersColorScheme: true,
        },
        algolia: {
            appId: '9HOG6FAKY7',
            apiKey: '44a99b1006be22882c8aba292e0176e6',
            indexName: 'vnpay-lib',
            contextualSearch: true,
        },
    } satisfies Preset.ThemeConfig,
    plugins: [
        [
            'vercel-analytics',
            {
                debug: true,
                mode: 'auto',
            },
        ],
    ],
    scripts: [
        {
            src: '/js/analytics.js',
            defer: true,
        },
    ],
};

export default config;
