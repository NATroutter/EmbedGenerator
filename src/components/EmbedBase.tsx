import React from 'react';
import Markdown from "../lib/markdown/Markdown";
import moment from 'moment';
import { Embed, EmbedAuthor, EmbedField, EmbedFooter } from '../lib/interfaces';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
}
const Link: React.FC<LinkProps> = ({ children, ...props }) => {
  return <a target='_blank' rel='noreferrer' {...props}>{children}</a>;
};

const ColorPill = ({ color } : { color?:string }) => {

  const style = { backgroundColor: color || "#202225" };
  return <div className='embed-color-pill' style={style} />;
}

interface TitleProps {title: string, url: string}

const Title = ({ title, url } : TitleProps) => {
  if (!title) {
    return null;
  }

  let computed = <div className='embed-title'><Markdown>{title}</Markdown></div>;
  if (url) {
    computed = <Link href={url} className='embed-title'><Markdown>{title}</Markdown></Link>;
  }

  return computed;
};

const Description = ({ content } : {content: string}) => {
  if (!content) {
    return null;
  }

  return <div className='embed-description markup'><Markdown>{content}</Markdown></div>;
};

const Author = ({ name, url, iconUrl } : EmbedAuthor) => {
  if (!name) {
    return null;
  }

  let authorName;
  if (name) {
    authorName = <span className='embed-author-name'>{name}</span>;
    if (url) {
      authorName = <Link href={url} className='embed-author-name'>{name}</Link>;
    }
  }

  const authorIcon = iconUrl ? (<img src={iconUrl} role='presentation' className='embed-author-icon' alt="embed author icon" />) : null;

  return <div className='embed-author'>{authorIcon}{authorName}</div>;
};

const Field = ({ name, value, inline, blank } : EmbedField) => {
  if (!name && !value) {
    return null;
  }

  const cls = 'embed-field' + (inline ? ' embed-field-inline' : '');

  if (!blank) {
    const fieldName = name ? (<div className='embed-field-name'><Markdown>{name}</Markdown></div>) : null;
    const fieldValue = value ? (<div className='embed-field-value markup'><Markdown>{value}</Markdown></div>) : null;

    return <div className={cls}>{fieldName}{fieldValue}</div>;
  } else {
    return <div className={cls}> </div>;
  }
};

const Thumbnail = ({ url } : {url:string}) => {
  if (!url) {
    return null;
  }

  return (
    <img
      src={url}
      role='presentation'
      className='embed-rich-thumb'
	  alt = "embed rich thumb"
      style={{ maxWidth: 80, maxHeight: 80 }}
    />
  );
};

const EImage = ({ url } : { url:string }) => {
  if (!url) {
    return null;
  }

  // NOTE: for some reason it's a link in the original DOM
  // not sure if this breaks the styling, probably does
  return (
    <a className='embed-thumbnail embed-thumbnail-rich'>
      <img className='image' role='presentation' src={url} alt="Embed Image" />
    </a>
  );
};

function formatTimestamp(time : number | undefined) : string {
    var unix : number = time !== undefined ? time : moment().unix();
    return moment(unix * 1000).calendar();
}


interface FooterProps {
  footer: EmbedFooter,
  timestamp?: number
}

const Footer = ({ footer, timestamp } : FooterProps) => {
  if (!footer.text && !timestamp) {
    return null;
  }

  const footerText = [footer.text, formatTimestamp(timestamp)].filter(Boolean).join(' | ');
  const footerIcon = footer.text && footer.iconUrl ? (
    <img src={footer.iconUrl} className='embed-footer-icon' role='presentation' width='20' height='20' alt="Footer Icon" />
  ) : null;

  return <div>{footerIcon}<span className='embed-footer'>{footerText}</span></div>;
};

const Fields = ({ fields } : {fields: EmbedField[]}) => {
  if (!fields) {
    return null;
  }

  return <div className='embed-fields'>{fields.map((f, i) => <Field key={i} {...f} />)}</div>;
};

export default function EmbedBase({ embed, errors } : { embed: Embed, errors: string | undefined}) {

  if (errors !== undefined) {
		return (
			<div></div>
		);
	}

  return (
    <div className="flex-vertical whitney theme-dark">
      <div className="chat flex-vertical flex-spacer">
        <div className="content flex-spacer flex-horizontal">
          <div className="flex-spacer flex-vertical messages-wrapper">
            <div className="scroller-wrap">
              <div className="scroller messages">
                <div className="message-group hide-overflow ">
                  <div className='accessory'>
                    <div className='embed-wrapper'>
                      <ColorPill color={embed.color} />
                      <div className='embed embed-rich'>
                        <div className='embed-content'>
                          <div className='embed-content-inner'>
                            <Author {...embed.author} />
                            <Title title={embed.title} url={embed.url} />
                            <Description content={embed.description} />
                            <Fields fields={embed.fields} />
                          </div>
                          <Thumbnail url={embed.thumbnail} />
                        </div>
                        <EImage url={embed.image} />
                        <Footer footer={embed.footer} timestamp={embed.timestamp} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};