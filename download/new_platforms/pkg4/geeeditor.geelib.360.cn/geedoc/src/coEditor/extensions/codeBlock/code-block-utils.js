import { AddMarkStep, RemoveMarkStep, ReplaceAroundStep, ReplaceStep } from "@tiptap/pm/transform";
import { uniqBy } from "lodash-es";

function isValidStep(step, StepTypes) {
  return StepTypes.length === 0 || StepTypes.some(Constructor => step instanceof Constructor);
}

function isRangeStep(step) {
  return isValidStep(step, [AddMarkStep, ReplaceAroundStep, ReplaceStep, RemoveMarkStep]);
}

/**
 * Deduplicate changes ranges and removes ranges that spanned by other ranges
 */
function removeOverlappingChangedRanges(ranges) {
  const uniqueRanges = uniqBy(
    ranges,
    ({ from, to, prevFrom, prevTo }) => `${from}_${to}_${prevFrom}_${prevTo}`
  );

  return uniqueRanges.filter(
    (range, i, arr) =>
      !arr.some((otherRange, j) => {
        if (i === j) {
          return false;
        }

        return (
          range.prevFrom >= otherRange.prevFrom
          && range.prevTo <= otherRange.prevTo
          && range.from >= otherRange.from
          && range.to <= otherRange.to
        );
      })
  );
}

/**
 * Get all the ranges of changes for the provided transaction.
 *
 * This can be used to gather specific parts of the document which require
 * decorations to be recalculated or where nodes should be updated.
 *
 * This is adapted from the answer
 * [here](https://discuss.prosemirror.net/t/find-new-node-instances-and-track-them/96/7)
 *
 * @param tr - the transaction received with updates applied.
 * @param StepTypes - the valid Step Constructors. Set to an empty array to
 * accept all Steps.
 */
function getChangedRanges(tr, StepTypes = []) {
  const ranges = [];
  const { steps, mapping } = tr;
  const inverseMapping = mapping.invert();

  steps.forEach((step, i) => {
    if (!isValidStep(step, StepTypes)) {
      return;
    }

    const rawRanges = [];
    const stepMap = step.getMap();
    const mappingSlice = mapping.slice(i);

    if (stepMap.ranges.length === 0 && isRangeStep(step)) {
      const { from, to } = step;
      rawRanges.push({ from, to });
    } else {
      stepMap.forEach((from, to) => {
        rawRanges.push({ from, to });
      });
    }

    rawRanges.forEach((range) => {
      const from = mappingSlice.map(range.from, -1);
      const to = mappingSlice.map(range.to);

      ranges.push({
        from,
        to,
        prevFrom: inverseMapping.map(from, -1),
        prevTo: inverseMapping.map(to)
      });
    });
  });

  // Sort the ranges.
  // const sortedRanges = sort(ranges, (a, z) => a.from - z.from);
  const sortedRanges = [...ranges].sort((a, z) => a.from - z.from);

  return removeOverlappingChangedRanges(sortedRanges);
}

function getChangedNodeRanges(tr, StepTypes) {
  // The container of the ranges to be returned from this function.
  const nodeRanges = [];
  const ranges = getChangedRanges(tr, StepTypes);

  for (const range of ranges) {
    try {
      const $from = tr.doc.resolve(range.from);
      const $to = tr.doc.resolve(range.to);

      // Find the node range for this provided range.
      const nodeRange = $from.blockRange($to);

      // Make sure a valid node is available.
      if (nodeRange) {
        nodeRanges.push(nodeRange);
      }
    } catch {
      // Changed ranged outside the document
    }
  }

  return nodeRanges;
}

export function getChangedNodes(
  tr,
  options = {}
) {
  const { descend = false, predicate, StepTypes } = options;
  const nodeRange = getChangedNodeRanges(tr, StepTypes);

  // The container for the nodes which have been added..
  const nodes = [];

  for (const range of nodeRange) {
    const { start, end } = range;

    // Find all the nodes between the provided node range.
    tr.doc.nodesBetween(start, end, (node, pos) => {
      // Check wether this is a node that should be added.
      const shouldAdd = predicate?.(node, pos, range) ?? true;

      if (shouldAdd) {
        nodes.push({ node, pos });
      }

      return descend;
    });
  }

  return nodes;
}
