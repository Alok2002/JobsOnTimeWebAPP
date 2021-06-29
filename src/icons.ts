import { library, IconDefinition, IconPack } from '@fortawesome/fontawesome-svg-core';
import { faFacebookF } from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { faTwitter } from '@fortawesome/free-brands-svg-icons/faTwitter';
import { faLinkedinIn } from '@fortawesome/free-brands-svg-icons/faLinkedinIn';
import { faGooglePlusG } from '@fortawesome/free-brands-svg-icons/faGooglePlusG';
import { faPinterestP } from '@fortawesome/free-brands-svg-icons/faPinterestP';
import { faCommentAlt } from '@fortawesome/free-solid-svg-icons/faCommentAlt';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons/faEnvelope';
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons/faWhatsapp';

var icons: Array<IconDefinition> = [faFacebookF, faTwitter, faLinkedinIn, faGooglePlusG, faPinterestP, faWhatsapp, faEnvelope, faCommentAlt];
library.add(...icons);