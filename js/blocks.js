(function (blocks, element, blockEditor, components, i18n) {
  var el = element.createElement;
  var __ = i18n.__;
  var useBlockProps = blockEditor.useBlockProps;
  var InspectorControls = blockEditor.InspectorControls;
  var PanelBody = components.PanelBody;
  var TextControl = components.TextControl;
  var ToggleControl = components.ToggleControl;
  var SelectControl = components.SelectControl;

  // Register Venue Name Block
  blocks.registerBlockType('show-fields/venue-name', {
    title: __('Venue Name', 'show-fields-blocks'),
    icon: 'store',
    category: 'show-fields',
    description: __('Display the venue name for a show.', 'show-fields-blocks'),
    supports: {
      html: false,
      reusable: false,
    },
    edit: function (props) {
      var blockProps = useBlockProps({
        className: 'show-venue-name',
      });

      return el(
        'div',
        blockProps,
        el('p', {}, __('Venue Name (Show Field)', 'show-fields-blocks'))
      );
    },
    save: function () {
      return null; // Dynamic block, rendered on server side
    },
  });

  // Register Show Date/Time Block
  blocks.registerBlockType('show-fields/show-date', {
    title: __('Show Date/Time', 'show-fields-blocks'),
    icon: 'calendar-alt',
    category: 'show-fields',
    description: __(
      'Display the date and time for a show.',
      'show-fields-blocks'
    ),
    attributes: {
      format: {
        type: 'string',
        default: 'd/m/Y g:i a',
      },
    },
    supports: {
      html: false,
      reusable: false,
    },
    edit: function (props) {
      var blockProps = useBlockProps({
        className: 'show-date-time',
      });

      function onChangeFormat(newFormat) {
        props.setAttributes({ format: newFormat });
      }

      return [
        el(
          InspectorControls,
          { key: 'inspector' },
          el(
            PanelBody,
            {
              title: __('Date Format Settings', 'show-fields-blocks'),
              initialOpen: true,
            },
            el(TextControl, {
              label: __('Date Format', 'show-fields-blocks'),
              value: props.attributes.format,
              onChange: onChangeFormat,
              help: __(
                'PHP date format. Default: d/m/Y g:i a',
                'show-fields-blocks'
              ),
            })
          )
        ),
        el(
          'div',
          blockProps,
          el('p', {}, __('Show Date/Time (Show Field)', 'show-fields-blocks'))
        ),
      ];
    },
    save: function () {
      return null; // Dynamic block, rendered on server side
    },
  });

  // Register Tickets Link Block
  blocks.registerBlockType('show-fields/tickets-link', {
    title: __('Tickets Link', 'show-fields-blocks'),
    icon: 'tickets-alt',
    category: 'show-fields',
    description: __(
      'Display a link to purchase tickets for a show.',
      'show-fields-blocks'
    ),
    attributes: {
      linkText: {
        type: 'string',
        default: 'Get Tickets',
      },
      buttonStyle: {
        type: 'boolean',
        default: true,
      },
      opensInNewTab: {
        type: 'boolean',
        default: true,
      },
    },
    supports: {
      html: false,
      reusable: false,
    },
    edit: function (props) {
      var blockProps = useBlockProps({
        className: 'show-tickets-link',
      });

      function onChangeLinkText(newText) {
        props.setAttributes({ linkText: newText });
      }

      function onChangeButtonStyle(newValue) {
        props.setAttributes({ buttonStyle: newValue });
      }

      function onChangeOpensInNewTab(newValue) {
        props.setAttributes({ opensInNewTab: newValue });
      }

      return [
        el(
          InspectorControls,
          { key: 'inspector' },
          el(
            PanelBody,
            {
              title: __('Link Settings', 'show-fields-blocks'),
              initialOpen: true,
            },
            el(TextControl, {
              label: __('Link Text', 'show-fields-blocks'),
              value: props.attributes.linkText,
              onChange: onChangeLinkText,
            }),
            el(ToggleControl, {
              label: __('Display as Button', 'show-fields-blocks'),
              checked: props.attributes.buttonStyle,
              onChange: onChangeButtonStyle,
            }),
            el(ToggleControl, {
              label: __('Open in New Tab', 'show-fields-blocks'),
              checked: props.attributes.opensInNewTab,
              onChange: onChangeOpensInNewTab,
            })
          )
        ),
        el(
          'div',
          blockProps,
          el('p', {}, __('Tickets Link (Show Field)', 'show-fields-blocks'))
        ),
      ];
    },
    save: function () {
      return null; // Dynamic block, rendered on server side
    },
  });

  // Register City/State Block
  blocks.registerBlockType('show-fields/city-state', {
    title: __('City/State', 'show-fields-blocks'),
    icon: 'location',
    category: 'show-fields',
    description: __(
      'Display the city and state for a show.',
      'show-fields-blocks'
    ),
    attributes: {
      separator: {
        type: 'string',
        default: ', ',
      },
    },
    supports: {
      html: false,
      reusable: false,
    },
    edit: function (props) {
      var blockProps = useBlockProps({
        className: 'show-city-state',
      });

      function onChangeSeparator(newSeparator) {
        props.setAttributes({ separator: newSeparator });
      }

      return [
        el(
          InspectorControls,
          { key: 'inspector' },
          el(
            PanelBody,
            {
              title: __('Separator Settings', 'show-fields-blocks'),
              initialOpen: true,
            },
            el(TextControl, {
              label: __('Separator', 'show-fields-blocks'),
              value: props.attributes.separator,
              onChange: onChangeSeparator,
              help: __(
                'Character(s) to display between city and state.',
                'show-fields-blocks'
              ),
            })
          )
        ),
        el(
          'div',
          blockProps,
          el('p', {}, __('City/State (Show Field)', 'show-fields-blocks'))
        ),
      ];
    },
    save: function () {
      return null; // Dynamic block, rendered on server side
    },
  });

  // Register Google Map Block
  blocks.registerBlockType('show-fields/google-map', {
    title: __('Venue Map', 'show-fields-blocks'),
    icon: 'location-alt',
    category: 'show-fields',
    description: __(
      'Display a Google Map for the venue location.',
      'show-fields-blocks'
    ),
    attributes: {
      height: {
        type: 'string',
        default: '300px',
      },
      width: {
        type: 'string',
        default: '100%',
      },
      showDirectionsLink: {
        type: 'boolean',
        default: true,
      },
    },
    supports: {
      html: false,
      reusable: false,
    },
    edit: function (props) {
      var blockProps = useBlockProps({
        className: 'show-google-map',
      });

      function onChangeHeight(newHeight) {
        props.setAttributes({ height: newHeight });
      }

      function onChangeWidth(newWidth) {
        props.setAttributes({ width: newWidth });
      }

      function onChangeShowDirections(newValue) {
        props.setAttributes({ showDirectionsLink: newValue });
      }

      return [
        el(
          InspectorControls,
          { key: 'inspector' },
          el(
            PanelBody,
            {
              title: __('Map Settings', 'show-fields-blocks'),
              initialOpen: true,
            },
            el(TextControl, {
              label: __('Height', 'show-fields-blocks'),
              value: props.attributes.height,
              onChange: onChangeHeight,
              help: __('CSS value (e.g., 300px, 50vh)', 'show-fields-blocks'),
            }),
            el(TextControl, {
              label: __('Width', 'show-fields-blocks'),
              value: props.attributes.width,
              onChange: onChangeWidth,
              help: __('CSS value (e.g., 100%, 500px)', 'show-fields-blocks'),
            }),
            el(ToggleControl, {
              label: __('Show Directions Link', 'show-fields-blocks'),
              checked: props.attributes.showDirectionsLink,
              onChange: onChangeShowDirections,
            })
          )
        ),
        el(
          'div',
          blockProps,
          el('p', {}, __('Venue Map (Show Field)', 'show-fields-blocks'))
        ),
      ];
    },
    save: function () {
      return null; // Dynamic block, rendered on server side
    },
  });
})(
  window.wp.blocks,
  window.wp.element,
  window.wp.blockEditor,
  window.wp.components,
  window.wp.i18n
);
